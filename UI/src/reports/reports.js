import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Menu from '../menu/menu';
import axios from 'axios'; // Import axios to fetch data
import * as d3 from 'd3';

function Reports() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [evData, setEvData] = useState([]); // State to store the EV usage data

  useEffect(() => {
    // Check if the token exists in localStorage
    const isLoggedIn = localStorage.getItem('token');
    
    if (!isLoggedIn) {
      // If the user is not logged in, show an alert and redirect to the login page
      alert('You must be logged in to access this page');
      navigate('/'); // Redirect to login page
    } else {
      // Fetch EV usage data
      axios.get('http://67.205.140.185:3000/api/evusage', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((response) => {
          setEvData(response.data); // Set the fetched data to state
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                alert('Session expired. Please log in again.');
                navigate('/');
            } else {
                // For other errors, log them
                console.error('Error fetching data:', error);
                alert('Error fetching EV usage data.');
            }
        });
    }
  }, [navigate]);

  // Function to draw the pie chart
  useEffect(() => {
    if (evData.length === 0) return; // Return if no data

    d3.select('#pie-container').selectAll('*').remove();

    const width = 500;
    const height = 500;
    const outerRadius = width / 2;
    const innerRadius = 100; // Donut chart effect

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Use predefined color scale

    const svg = d3.select('#pie-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcGenerator = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const pieGenerator = d3.pie().value(d => d.amount);

    const arcs = svg.selectAll('arc')
      .data(pieGenerator(evData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arcGenerator)
      .style('fill', (d, i) => colorScale(i));

    arcs.append('text')
      .attr('transform', (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .attr('text-anchor', 'middle')
      .text(d => d.data.categoryName);
  }, [evData]);

  return (
    <>
      <Menu />
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12 pa-2">
              <h1 className="text-center">Reports Page</h1>
            </div>
            <div className="col-md-12 text-center">
              <h3 className="text-center">Global EVs Usage</h3>
              <p>EVs include BEVs and PHEVs. Inroads on transportation are being made by these electric vehicles, dominated by the growth of BEVs enabled through more advanced battery technologies, while the latter provides flexibility in the travel of customers. The expanding charging infrastructure and future innovations, like solid-state batteries, will keep this technology adoption going strong, hence facilitating the transition to clean energy.</p>
            </div>
            <div className="col-md-12 text-center" id="pie-container"></div>
            <div className="col-md-12">
              <p>The pie chart depicts the distribution of investments within the EV industry: 65% in Battery Electric Vehicles, 20% in Plug-in Hybrid Electric Vehicles, 10% in EV Charging Infrastructure, and 5% in Research & Development. This distribution indicates that BEVs are the dominant players in the sector while highlighting the need to improve infrastructure and innovation for sustainable mobility.</p>
              <p><a href='https://www.weforum.org/stories/2023/09/renewable-energy-innovations-climate-emergency/' target='_blank' rel='noopener noreferrer'>Link for Reference</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;

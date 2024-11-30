import React, { useEffect, useRef, useState } from 'react';
import Menu from '../menu/menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as d3 from 'd3';

function Dashboard() {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState([]);
    const svgRef = useRef();

    useEffect(() => {
        // Check if the token exists in localStorage
        const isLoggedIn = localStorage.getItem('token');
        if (!isLoggedIn) {
            alert('You must be logged in to access this page');
            navigate('/');
        }

        // Fetch data from the backend using Axios
        axios
            .get('http://67.205.140.185:3000/api/electronicvehiclesales', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                const formattedData = response.data.map((item) => ({
                    year: item.year,
                    sales: item.SalesinMillions,
                }));
                setSalesData(formattedData);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    alert('Session expired. Please log in again.');
                    navigate('/');
                } else {
                    // For other errors, log them
                    console.error('Error fetching sales data:', error);
                }
            });    
        }, [navigate]);

    useEffect(() => {
        if (salesData.length === 0) return;
    
        // Clear existing SVG content
        d3.select(svgRef.current).selectAll('*').remove();
    
        // Set up SVG dimensions
        const width = 400;
        const height = 200;
        const margin = { top: 40, right: 30, bottom: 50, left: 70 };
    
        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    
        // Set scales
        const xScale = d3
            .scaleBand()
            .domain(salesData.map((d) => d.year.toString()))
            .range([0, width])
            .padding(0.2);
    
        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(salesData, (d) => d.sales)])
            .range([height, 0]);
    
        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text('Year'); // X-axis label
    
        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5))
            .append('text')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('font-size', '12px')
            .text('Sales (in Millions)'); // Y-axis label
    
        // Draw line
        const line = d3
            .line()
            .x((d) => xScale(d.year.toString()) + xScale.bandwidth() / 2)
            .y((d) => yScale(d.sales))
            .curve(d3.curveMonotoneX);
    
        svg.append('path')
            .datum(salesData)
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('d', line);
    
        // Add data points
        svg.selectAll('.dot')
            .data(salesData)
            .join('circle')
            .attr('cx', (d) => xScale(d.year.toString()) + xScale.bandwidth() / 2)
            .attr('cy', (d) => yScale(d.sales))
            .attr('r', 4)
            .attr('fill', 'blue');
    
        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .text('Global Electric Vehicle Sales (2017-2022)');
    }, [salesData]);
    
    return (
        <>
            <Menu />
            <div className="py-5 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 pa-2">
                            <h1 className="text-center">Summary Page</h1>
                        </div>
                        <div className="col-md-12 text-center">
                            <h3 className="text-center">Global EVs Usage</h3>
                            <p>
                                This graph depicts six years of global electric vehicle sales,
                                showcasing the current trend in greener transport options. It
                                highlights key milestones, such as the nearly fivefold growth
                                since 2017, driven by increasing consumer demand, improvements
                                in EV technology, and ambitious sustainability goals set across
                                the globe.
                            </p>
                        </div>
                        <div className="col-md-12 text-center">
                            <svg ref={svgRef}></svg>
                        </div>
                        <div className="col-md-12">
                            <p>This chart shows the global trend in EV sales over a period of six years, reflecting the way in which greener transport options are becoming increasingly attractive. It highlights key milestones, such as a nearly fivefold growth since 2017, driven by increasing consumer demand, improvements in EV technologies, and ambitious sustainability goals set by governments worldwide.</p>
                            <p><a href='https://www.iea.org/reports/clean-energy-innovation/clean-energy-innovation-needs-faster-progress' target='_blank'>Link for Reference</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;


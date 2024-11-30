import React, { useEffect } from 'react';
import Menu from '../menu/menu';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function Dashboard() {
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        // Check if the token exists in localStorage
        const isLoggedIn = localStorage.getItem('token');
        
        if (!isLoggedIn) {
        // If the user is not logged in, show an alert and redirect to the login page
        alert('You must be logged in to access this page');
        navigate('/'); // Redirect to login page
        }
    }, [navigate]);

    return (
        <>
            <Menu/>
            <div className="py-5 bg-light">
                <div className="container">
                    <div className="row">
                        <div className='col-md-12 pa-2'>
                            <h1 className='text-center'>Dashboard Page</h1>
                        </div>
                        <div className='col-md-12'>
                            <h3 className='text-center'>Technologies Used</h3>
                        </div>
                        <p>The S93 web application brings together Node.js for a powerful backend, MySQL for security and scaling of data, and React for a dynamic, responsitive frontend. This technology stack will enable real-time data processing, seamless integration of the database, and a truly interactive UI in order to explore effectively and intuitively clean energy innovations.</p>
                        <div className='col-md-12'>
                            <h3 className='text-center'>Summary of Article</h3>
                        </div>
                    <p>Recent clean energy innovations have been essential in speeding up the transition towards a more sustainable world energy system. Among the most recognized features is the rapid growth of the solar and electric vehicle technologies. The global solar photovoltaic capacity, for example, surged to 340 gig watts in 2022, marking a record. The sales of electric vehicles similarly reached an all-time high of over 10 million in 2022, a nearly tenfold increase in only five years. Major policies that support such growth include the U.S. Inflation Reduction Act and the European Green Deal, both of which aim to cut carbon emissions.</p>
                    <p>Clean energy technology innovations aren't constrained to solar and EVs only. Heat pumps are also growing strongly, especially in Europe and China, since these are very important for heating and cooling in a more energy-efficient way. Moreover, significant advances have been made in CCUS, while governments are investing billions of dollars in support of such technologies.</p>
                    <p>However, many challenges persist in heavy industry and long-distance transport sectors where low-emission technologies are not yet available or at a nascent stage. In several sectors, such as hydrogen production, new technologies have been delayed during commercialization, though the commitments taken up from governments and private sectors continue to be realized.While this progress is important, continued innovation and much stronger international cooperation are required to accelerate these technologies more quickly around the world-especially in emerging markets​.</p>
                    <p><a href='https://www.iea.org/news/rapid-progress-of-key-clean-energy-technologies-shows-the-new-energy-economy-is-emerging-faster-than-many-think' target='_blank'>Link for Reference</a></p>
                    </div>
                </div>
            </div>

        </>
    )
}
export default Dashboard;

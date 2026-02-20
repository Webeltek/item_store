import './About.css'

export default function About(){
    return (
        <>
        <section className="about-hero">
            <div className="container">
                <h2>About Webeltek PiMonitor</h2>
                <p>Your trusted source for Pi boards with monitoring and accessories.</p>
            </div>
        </section>

        <section className="about-content">
            <div className="container">
                <h3 className="mt-[100px]">Our Mission</h3>
                <p>We aim to offer Pi boards with monitoring capabilities at affordable prices.</p>
                <h3>Our Values</h3>
                <ul>
                    <li>Quality: We only offer boards that have been tested.</li>
                    <li>Customer Service: Our team is here to help you with any questions or concerns you may have.</li>
                </ul>
            </div>
        </section>        
        </>
    )
}
import './About.css'

export default function About(){
    return (
        <>
        <section className="about-hero">
            <div className="container">
                <h2>About Tv Store</h2>
                <p>Your trusted source for TVs and accessories.</p>
            </div>
        </section>

        <section className="about-content">
            <div className="container">
                <h3 className="mt-[100px]">Our Mission</h3>
                <p>We aim to offer TVs at affordable prices.</p>
                <h3>Our Values</h3>
                <ul>
                    <li>Quality: We only offer TVs that have been tested.</li>
                    <li>Customer Service: Our team is here to help you with any questions or concerns you may have.</li>
                </ul>
            </div>
        </section>        
        </>
    )
}
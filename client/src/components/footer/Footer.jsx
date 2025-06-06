import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer(){
    return (
        <footer>
            <div>
                <p style={{ fontWeight: "bold"}}>This site is under construction</p>
                <Link to="/privacy-policy">Privacy policy</Link>
                <p>&copy; 2025 TvStore,  Webeltek Velislav Velikov</p>
                <p> </p>
            </div>
        </footer>
    )
}
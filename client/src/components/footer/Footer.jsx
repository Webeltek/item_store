import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer(){
    return (
        <footer>
            <div>
                <p style={{ fontWeight: "bold"}}>This site is under construction</p>
                <Link to="/privacy-policy">Privacy policy</Link>
                <p>Webeltek Pi Monitor Boards &copy; 2025 Webeltek Velislav Velikov 915621791 MVA (VAT)</p>
                <p> </p>
            </div>
        </footer>
    )
}
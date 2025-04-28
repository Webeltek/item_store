import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer(){
    return (
        <footer>
            <div className="container-footer">
                <Link to="/privacy-policy">Privacy policy</Link>
                <p>&copy; 2025 TvStore</p>
            </div>
        </footer>
    )
}
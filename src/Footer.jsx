import FooterButton from './FooterButton.jsx'
import homeIcon from './assets/home.png';
import timerIcon from './assets/timer.png';
import statsIcon from './assets/stats.png';
import agilityIcon from './assets/agility.png';


function Footer({setScreen}){

    return (
        <div className="Footer">
            <FooterButton onClick={() => setScreen("home")} imageSource={homeIcon} />
            <FooterButton onClick={() => setScreen("paceSetter")} imageSource={agilityIcon} />
            <FooterButton onClick={() => setScreen("stopwatch")} imageSource={timerIcon} />
            <FooterButton onClick={() => setScreen("stats")} imageSource={statsIcon} />
        </div>
    );
}

export default Footer;
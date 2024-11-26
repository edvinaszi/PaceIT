
function FooterButton({ onClick, imageSource }){
    return (
        <div onClick={onClick}>
            <img src={imageSource} className="FooterButton"/>
        </div>
    );
}

export default FooterButton;
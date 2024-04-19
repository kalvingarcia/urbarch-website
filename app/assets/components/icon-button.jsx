import Button from './button';
import '../styles/components/icon-button.scss';

export default function IconButton({className, icon, ...props}) {
    return (
        <Button className={["icon-button", className? className : ""].join(" ")} {...props}>
            <i className="material-icons">{icon}</i>
        </Button>
    );
}
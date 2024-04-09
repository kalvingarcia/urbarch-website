import Button from './button';
import '../assets/styles/components/icon-button.scss';

export default function IconButton({className, icon, onPress, ...props}) {
    return (
        <Button className={["icon-button", className? className : ""].join(" ")} onPress={onPress} {...props}>
            <i className="material-icons">{icon}</i>
        </Button>
    );
}
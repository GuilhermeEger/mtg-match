export default function Icon({icon, className}: {icon: string; className?: string}) {
    let content;

    switch (icon) {
        case "minus":
            content = 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <rect x="4" y="10" width="16" height="4" />
            </svg>;
            break;
        case "plus":
            content = 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <rect x="10" y="4" width="4" height="16" />
                <rect x="4" y="10" width="16" height="4" />
            </svg>;
            break;
        default:
            content = <span></span>;
            break;
    }

    return (
        <div className={className}>
            {content}
        </div>
    );
}
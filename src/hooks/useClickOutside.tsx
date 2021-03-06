import * as React from 'react';

export function useClickOutside(Component: any, onClickOutside: () => void) {
    return (props: {}) => {
        const node: any = React.useRef();

        const handleClick = (ev: any) => {
            if (!node.current.contains(ev.target)) {
                onClickOutside();
            }
        };

        React.useEffect(() => {
            document.addEventListener('click', handleClick);
            return (): void => document.removeEventListener('click', handleClick);
        }, []);

        return (
            <div ref={node}>
                <Component {...props} />
            </div>
        );
    };
}

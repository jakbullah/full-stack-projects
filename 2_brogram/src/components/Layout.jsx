export default function Layout(props) {

// Destructure children from props — any nested JSX passed to <Layout> will appear here

    const {children} = props


    const header = (
        <header>
            <h1 className="text-gradient">The Brogram</h1>
            <p><strong>The 30 Simple Workouts Program</strong></p>
        </header>
    )

    const footer = (
        <footer>
            <p>Built by <a href="" target="">Jake Butler</a><br />Styled with <a href="" target="">FantaCSS</a></p>
        </footer>
    )

    return (
        <>
            {header}
            {children}
            {footer}
        </>
    )

}
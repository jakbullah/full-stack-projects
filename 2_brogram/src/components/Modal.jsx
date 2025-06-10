import ReactDom from 'react-dom'

//     🧠 Summary of What This Component Does
// Displays a modal overlay using ReactDOM.createPortal, rendering into a #portal DOM node.
// Receives showExerciseDescription (with name and description) and a handleCloseModal callback via props.
// Modal closes when the semi-transparent underlay is clicked.
// Formats the name by replacing dashes with spaces for readability.
// Used to show extra info (e.g., exercise descriptions) from the WorkoutCard component.


export default function Modal(props) {
    // Destructure props passed from parent
    const { showExerciseDescription, handleCloseModal } = props

    // Extract exercise name and description (if available)
    const { name, description } = showExerciseDescription || {}

    // Render the modal using a React portal into the #portal element in the DOM
    return ReactDom.createPortal((
        <div className='modal-container'>

            {/* Clickable background underlay to close the modal */}
            <button
                className='modal-underlay'
                onClick={handleCloseModal}
            />

            {/* Main modal content */}
            <div className='modal-content'>
                <div>
                    <h6>Name</h6>

                    {/* Format the name by replacing dashes with spaces */}
                    <h2 className='skill-name'>{name.replaceAll('-', ' ')}</h2>
                </div>

                <div>
                    <h6>Description</h6>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    ),
    // Mount modal content to the DOM node with id="portal"
    document.getElementById('portal')
    )
}
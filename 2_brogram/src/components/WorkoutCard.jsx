import React, { useState } from "react"
import Modal from "./Modal"
import { exerciseDescriptions } from "../utils"

// //🧠 Summary of What This Component Does
// Displays warmup and workout exercises for a given training day, with sets, reps, and (for workout) weight input.
// Shows a modal with exercise descriptions when the help icon is clicked.
// Tracks weights entered by the user via local weights state.
// Warmup inputs are disabled and show "N/A"; only workout exercises allow weight entry.
// Save & Exit stores workout data using handleSave.
// Complete marks the workout as finished via handleComplete, only enabled if all weights are filled.
// Props-driven: Receives plan data, icons, saved state, and handler functions from the parent.


export default function WorkoutCard(props) {
    // Props passed in from Grid component
    const {
        trainingPlan,
        workoutIndex,
        type,
        dayNum,
        icon,
        savedWeights,
        handleSave,
        handleComplete
    } = props

    // Destructure the warmup and workout exercises from the training plan
    const { warmup, workout } = trainingPlan || {}

    // State to control visibility and content of the modal
    const [showExerciseDescription, setShowExerciseDescription] = useState(null)

    // State to track user inputted weights per exercise
    const [weights, setWeights] = useState(savedWeights || {})

    // Update weight input for a given exercise name
    function handleAddWeight(title, weight) {
        const newObj = {
            ...weights,
            [title]: weight
        }
        setWeights(newObj)
    }

    return (
        <div className="workout-container">

            {/* Render modal if an exercise description is selected */}
            {showExerciseDescription && (
                <Modal
                    showExerciseDescription={showExerciseDescription}
                    handleCloseModal={() => setShowExerciseDescription(null)}
                />
            )}

            {/* Header Card */}
            <div className="workout-card card">
                <div className="plan-card-header">
                    <p>Day {dayNum}</p>
                    {icon}
                </div>
                <div className="plan-card-header">
                    <h2><b>{type} Workout</b></h2>
                </div>
            </div>

            {/* Warmup Section (weights are disabled for warmup) */}
            <div className="workout-grid">
                <div className="exercise-name">
                    <h4>Warmup</h4>
                </div>
                <h6>Sets</h6>
                <h6>Reps</h6>
                <h6 className="weight-input">Max Weight</h6>

                {warmup.map((warmupExercise, warmupIndex) => (
                    <React.Fragment key={warmupIndex}>
                        <div className="exercise-name">
                            <p>{warmupIndex + 1}. {warmupExercise.name}</p>

                            {/* Help icon button to show exercise description */}
                            <button
                                onClick={() => {
                                    setShowExerciseDescription({
                                        name: warmupExercise.name,
                                        description: exerciseDescriptions[warmupExercise.name]
                                    })
                                }}
                                className="help-icon"
                            >
                                <i className="fa-regular fa-circle-question" />
                            </button>
                        </div>
                        <p className="exercise-info">{warmupExercise.sets}</p>
                        <p className="exercise-info">{warmupExercise.reps}</p>
                        <input
                            value={weights[warmupExercise.name] || ''}
                            onChange={(e) => {
                                handleAddWeight(warmupExercise.name, e.target.value)
                            }}
                            className="weight-input"
                            placeholder=""
                        />
                    </React.Fragment>
                ))}
            </div>

            {/* Workout Section (user enters weight for each exercise) */}
            <div className="workout-grid">
                <div className="exercise-name">
                    <h4>Workout</h4>
                </div>
                <h6>Sets</h6>
                <h6>Reps</h6>
                <h6 className="weight-input">Max Weight</h6>

                {workout.map((workoutExercise, wIndex) => (
                    <React.Fragment key={wIndex}>
                        <div className="exercise-name">
                            <p>{wIndex + 1}. {workoutExercise.name}</p>

                            {/* Help icon to trigger modal with description */}
                            <button
                                onClick={() => {
                                    setShowExerciseDescription({
                                        name: workoutExercise.name,
                                        description: exerciseDescriptions[workoutExercise.name]
                                    })
                                }}
                                className="help-icon"
                            >
                                <i className="fa-regular fa-circle-question" />
                            </button>
                        </div>
                        <p className="exercise-info">{workoutExercise.sets}</p>
                        <p className="exercise-info">{workoutExercise.reps}</p>

                        {/* Weight input for each workout exercise */}
                        <input
                            value={weights[workoutExercise.name] || ''}
                            onChange={(e) => {
                                handleAddWeight(workoutExercise.name, e.target.value)
                            }}
                            className="weight-input"
                            placeholder=""
                        />
                    </React.Fragment>
                ))}
            </div>

            {/* Save & Complete Buttons */}
            <div className="workout-buttons">
                {/* Save workout data and close card */}
                <button onClick={() => {
                    handleSave(workoutIndex, { weights })
                }}>
                    Save & Exit
                </button>

                {/* Mark workout as complete (only if all exercises have weight input) */}
                <button
                    onClick={() => {
                        handleComplete(workoutIndex, { weights })
                    }}
                    disabled={Object.keys(weights).length !== workout.length}
                >
                    Complete
                </button>
            </div>
        </div>
    )
}
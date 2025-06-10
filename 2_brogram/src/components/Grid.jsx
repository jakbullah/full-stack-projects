import { useState, useEffect } from 'react'
import { workoutProgram as training_plan } from '../utils/index.js'
import WorkoutCard from './WorkoutCard.jsx'

//🧠 Summary of What This Component Does
//Initial load: pulls saved progress from localStorage (brogram key).
//Workout unlock logic: only allows access to the next workout in sequence.
//Handles selection: shows a WorkoutCard when a workout is clicked (if not locked).
//Supports save and complete functionality, both saved to state and localStorage.

export default function Grid() {
    // State to hold previously saved workout data from localStorage
    const [savedWorkouts, setSavedWorkouts] = useState(null)

    // State to track which workout (if any) is currently selected (to show its card)
    const [selectedWorkout, setSelectedWorkout] = useState(null)

    // Derive a list of completed workout indexes from savedWorkouts
    const completedWorkouts = Object.keys(savedWorkouts || {}).filter((val) => {
        const entry = savedWorkouts[val]
        return entry.isComplete
    })

    // Called when a workout is saved (in progress or complete)
    function handleSave(index, data) {
        // Merge current data with saved data, keeping track of completion status
        const newObj = {
            ...savedWorkouts,
            [index]: {
                ...data,
                isComplete: !!data.isComplete || !!savedWorkouts?.[index]?.isComplete
            }
        }

        // Update state and save to localStorage
        setSavedWorkouts(newObj)
        localStorage.setItem('brogram', JSON.stringify(newObj))

        // Exit workout card view
        setSelectedWorkout(null)
    }

    // Mark a workout as completed and save it
    function handleComplete(index, data) {
        const newObj = { ...data }
        newObj.isComplete = true
        handleSave(index, newObj)
    }

    // On first mount, load saved workout data from localStorage
    useEffect(() => {
        if (!localStorage) return

        let savedData = {}
        if (localStorage.getItem('brogram')) {
            savedData = JSON.parse(localStorage.getItem('brogram'))
        }

        setSavedWorkouts(savedData)
    }, [])

    return (
        <div className="training-plan-grid">
            {Object.keys(training_plan).map((workout, workoutIndex) => {
                // Determine if the current workout should be locked
                // Only the next uncompleted workout is unlocked
                const isLocked = workoutIndex === 0
                    ? false
                    : !completedWorkouts.includes(`${workoutIndex - 1}`)

                console.log(workoutIndex, isLocked)

                // Determine workout type based on index
                const type = workoutIndex % 3 === 0
                    ? 'Push'
                    : workoutIndex % 3 === 1
                        ? 'Pull'
                        : 'Legs'

                // Get the specific training plan for this day
                const trainingPlan = training_plan[workoutIndex]

                // Format the day number (e.g. "01", "02", ..., "10")
                const dayNum = ((workoutIndex / 8) <= 1)
                    ? '0' + (workoutIndex + 1)
                    : workoutIndex + 1

                // Choose an icon based on workout type
                const icon = workoutIndex % 3 === 0 ? (
                    <i className='fa-solid fa-dumbbell'></i>
                ) : workoutIndex % 3 === 1 ? (
                    <i className='fa-solid fa-weight-hanging'></i>
                ) : (
                    <i className='fa-solid fa-bolt'></i>
                )

                // If the workout is selected, render the WorkoutCard instead of a button
                if (workoutIndex === selectedWorkout) {
                    return (
                        <WorkoutCard
                            key={workoutIndex}
                            savedWeights={savedWorkouts?.[workoutIndex]?.weights}
                            handleSave={handleSave}
                            handleComplete={handleComplete}
                            trainingPlan={trainingPlan}
                            type={type}
                            workoutIndex={workoutIndex}
                            icon={icon}
                            dayNum={dayNum}
                        />
                    )
                }

                // Default rendering of a clickable workout "card" (button)
                return (
                    <button
                        key={workoutIndex}
                        onClick={() => {
                            // Prevent opening if workout is locked
                            if (isLocked) return
                            setSelectedWorkout(workoutIndex)
                        }}
                        className={'card plan-card ' + (isLocked ? 'inactive' : '')}
                    >
                        <div className='plan-card-header'>
                            <p>Day {dayNum}</p>
                            {/* Lock icon if locked, otherwise show the type icon */}
                            {isLocked ? (
                                <i className='fa-solid fa-lock'></i>
                            ) : (icon)}
                        </div>

                        <div className='plan-card-header'>
                            <h4><b>{type}</b></h4>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}
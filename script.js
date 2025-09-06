class ExerciseTracker {
    constructor() {
        this.sets = [];
        this.currentSetId = 0;
        this.initializeEventListeners();
        this.addInitialSet();
    }

    initializeEventListeners() {
        // Image upload
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');
        const exerciseImage = document.getElementById('exerciseImage');
        const uploadedImage = document.getElementById('uploadedImage');

        imageUploadArea.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImage.src = e.target.result;
                    imageUploadArea.style.display = 'none';
                    exerciseImage.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Play button for video simulation
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                alert('Video playback would start here!');
            });
        }

        // Add set button
        const addSetBtn = document.getElementById('addSetBtn');
        addSetBtn.addEventListener('click', () => {
            this.addNewSet();
        });

        // Add exercise button
        const addExerciseBtn = document.getElementById('addExerciseBtn');
        addExerciseBtn.addEventListener('click', () => {
            this.saveExercise();
        });

        // Back button
        const backBtn = document.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
                window.history.back();
            }
        });

        // Auto-save on input changes
        this.setupAutoSave();
    }

    setupAutoSave() {
        const inputs = [
            'brandInput',
            'exerciseNameInput',
            'targetReps'
        ];

        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.autoSave();
                });
            }
        });
    }

    addInitialSet() {
        this.addNewSet(10, 15, 60);
    }

    addNewSet(reps = '', weight = '', rest = '') {
        const setId = this.currentSetId++;
        const set = {
            id: setId,
            reps: reps,
            weight: weight,
            rest: rest
        };

        this.sets.push(set);
        this.renderSets();
        this.autoSave();
    }

    removeSet(setId) {
        this.sets = this.sets.filter(set => set.id !== setId);
        this.renderSets();
        this.autoSave();
    }

    updateSet(setId, field, value) {
        const set = this.sets.find(s => s.id === setId);
        if (set) {
            set[field] = value;
            this.autoSave();
        }
    }

    renderSets() {
        const setsContainer = document.getElementById('setsContainer');
        setsContainer.innerHTML = '';

        this.sets.forEach((set, index) => {
            const setElement = document.createElement('div');
            setElement.className = 'set-item';

            // Create set info container
            const setInfo = document.createElement('div');
            setInfo.className = 'set-info';

            // Create reps group
            const repsGroup = this.createSetGroup('Reps', set.reps, '10', set.id, 'reps');
            const weightGroup = this.createSetGroup('Weight', set.weight, '15', set.id, 'weight');
            const restGroup = this.createSetGroup('Rest', set.rest, '60', set.id, 'rest');

            setInfo.appendChild(repsGroup);
            setInfo.appendChild(weightGroup);
            setInfo.appendChild(restGroup);

            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-set-btn';
            deleteBtn.title = 'Delete set';
            deleteBtn.addEventListener('click', () => this.removeSet(set.id));
            
            const trashIcon = document.createElement('i');
            trashIcon.className = 'fas fa-trash';
            deleteBtn.appendChild(trashIcon);

            setElement.appendChild(setInfo);
            setElement.appendChild(deleteBtn);

            // Add active class to the last set
            if (index === this.sets.length - 1) {
                setElement.classList.add('active');
            }

            setsContainer.appendChild(setElement);
        });
    }

    createSetGroup(label, value, placeholder, setId, field) {
        const group = document.createElement('div');
        group.className = 'set-group';

        const labelElement = document.createElement('div');
        labelElement.className = 'set-label';
        labelElement.textContent = label;

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'set-value';
        input.value = value;
        input.placeholder = placeholder;
        input.addEventListener('change', (e) => {
            this.updateSet(setId, field, e.target.value);
        });

        group.appendChild(labelElement);
        group.appendChild(input);

        return group;
    }

    getExerciseData() {
        return {
            brand: document.getElementById('brandInput').value,
            exerciseName: document.getElementById('exerciseNameInput').value,
            targetReps: document.getElementById('targetReps').value,
            sets: this.sets,
            image: document.getElementById('uploadedImage').src || null,
            timestamp: new Date().toISOString()
        };
    }

    saveExercise() {
        const exerciseData = this.getExerciseData();
        
        // Validate required fields
        if (!exerciseData.exerciseName.trim()) {
            alert('Please enter an exercise name');
            return;
        }

        if (this.sets.length === 0) {
            alert('Please add at least one set');
            return;
        }

        // Show loading state
        const addBtn = document.getElementById('addExerciseBtn');
        addBtn.classList.add('loading');
        addBtn.textContent = 'SAVING...';

        // Simulate save operation
        setTimeout(() => {
            // Save to localStorage for demo purposes
            const savedExercises = JSON.parse(localStorage.getItem('exercises') || '[]');
            savedExercises.push(exerciseData);
            localStorage.setItem('exercises', JSON.stringify(savedExercises));

            // Reset loading state
            addBtn.classList.remove('loading');
            addBtn.textContent = 'ADD';

            // Show success message
            alert(`Exercise "${exerciseData.exerciseName}" saved successfully!`);
            
            // Optionally reset the form
            this.resetForm();
        }, 1000);
    }

    resetForm() {
        // Reset form fields
        document.getElementById('brandInput').value = 'UNICA';
        document.getElementById('exerciseNameInput').value = 'Arm curl';
        document.getElementById('targetReps').value = '10';
        
        // Reset image
        document.getElementById('imageUploadArea').style.display = 'flex';
        document.getElementById('exerciseImage').style.display = 'none';
        document.getElementById('uploadedImage').src = '';
        document.getElementById('imageInput').value = '';
        
        // Reset sets
        this.sets = [];
        this.currentSetId = 0;
        this.addInitialSet();
    }

    autoSave() {
        // Auto-save to localStorage
        const exerciseData = this.getExerciseData();
        localStorage.setItem('currentExercise', JSON.stringify(exerciseData));
    }

    loadAutoSaved() {
        const saved = localStorage.getItem('currentExercise');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // Load form data
                if (data.brand) document.getElementById('brandInput').value = data.brand;
                if (data.exerciseName) document.getElementById('exerciseNameInput').value = data.exerciseName;
                if (data.targetReps) document.getElementById('targetReps').value = data.targetReps;
                
                // Load image
                if (data.image) {
                    document.getElementById('uploadedImage').src = data.image;
                    document.getElementById('imageUploadArea').style.display = 'none';
                    document.getElementById('exerciseImage').style.display = 'block';
                }
                
                // Load sets
                if (data.sets && data.sets.length > 0) {
                    this.sets = data.sets;
                    this.currentSetId = Math.max(...data.sets.map(s => s.id)) + 1;
                    this.renderSets();
                }
            } catch (e) {
                console.error('Error loading auto-saved data:', e);
            }
        }
    }

    // Utility method to get all saved exercises
    getAllExercises() {
        return JSON.parse(localStorage.getItem('exercises') || '[]');
    }

    // Utility method to clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all saved exercises? This cannot be undone.')) {
            localStorage.removeItem('exercises');
            localStorage.removeItem('currentExercise');
            alert('All data cleared successfully!');
        }
    }
}

// Initialize the exercise tracker when the page loads
let exerciseTracker;

document.addEventListener('DOMContentLoaded', () => {
    exerciseTracker = new ExerciseTracker();
    exerciseTracker.loadAutoSaved();
});

// Add some utility functions to the global scope for debugging
window.exerciseTracker = exerciseTracker;
window.clearAllData = () => exerciseTracker.clearAllData();
window.getAllExercises = () => exerciseTracker.getAllExercises();

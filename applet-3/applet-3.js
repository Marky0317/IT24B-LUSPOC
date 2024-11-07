class StudentList {
    constructor(dataUrl) {
        this.dataUrl = dataUrl;
        this.students = [];
        this.init();
    }

    async init() {
        await this.fetchData();
        this.renderStudentList(this.students); 
        this.bindSearchEvent();
    }

    async fetchData() {
        try {
            const response = await fetch(this.dataUrl);
            this.students = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    renderStudentList(students) {
        const studentSearchListContainer = document.getElementById('studentSearchList');
        studentSearchListContainer.innerHTML = ''; 

        students.forEach(student => {
            studentSearchListContainer.innerHTML += `
                <p> ${student.student_name}</p>
                <p class="fw-light"> ${student.student_program} </p>
                <hr>
            `;
        });
    }
    
    bindSearchEvent() {
        const studentSearchBar = document.getElementById('studentSearchBar');

        studentSearchBar.addEventListener('input', () => {
            this.filterStudents(studentSearchBar.value);
        });

        this.renderStudentList(this.students);
    }

    filterStudents(query) {
        const filteredStudents = this.students.filter(student => {
            const fullName = `${student.student_name} ${student.student_program}`;
            return fullName.toLowerCase().includes(query.toLowerCase());
        });

        this.renderStudentList(filteredStudents);
    }
}

const studentList = new StudentList('applet-4.json');
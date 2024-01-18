document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

   // Colectează valorile din formular
   const name = document.getElementById('name').value;
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   const role = document.getElementById('role').value;

   // Inițializează manager_name ca un string gol
   let manager_name = '';

   // Dacă rolul selectat este 'executant', obține valoarea selectată din managerSelect
   if (role === 'executant') {
       manager_name = document.getElementById('managerSelect').value;
   }

   // Creați un obiect cu datele utilizatorului
   const userData = {
       name,
       email,
       password,
       role,
       manager_name // Acesta va fi un string gol dacă rolul nu este 'executant'
   };

   // Trimite datele la server
   registerUser(userData);
});

document.getElementById('createTaskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('taskDescription').value;
    const managerName = document.getElementById('taskManager').value; 
    const assigneeName = document.getElementById('taskAssignee').value; 
    const token = localStorage.getItem('token'); 

    createTask({
        description: description,
        assigneeName: assigneeName, 
        managerName:managerName
    }, token);
});

function createTask(taskData, token) {
    fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': `application/json`,
            'Authorization': `Bearer ${token} `
        },
        body: JSON.stringify(taskData)
         
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la crearea task-ului');
        }
        return response.json();
    })
    .then(newTask => {
        console.log('Task creat:', newTask);
        
        addTaskToTable(newTask.description, newTask.managerName, newTask.assigneeName, newTask.status); 
    })
    .catch(error => {
        console.error('Eroare:', error);
        alert('Eroare la crearea task-ului ');
    });
}

document.getElementById('role').addEventListener('change', function(event) {
    if (event.target.value === 'executant') {
        // Afișați selectul pentru manager și populați-l cu date din server
        document.getElementById('managerSelectGroup').style.display = 'block';
        fetchManagers();
    } else {
        // Ascundeți selectul pentru manager
        document.getElementById('managerSelectGroup').style.display = 'none';
    }
});

function fetchManagers() {
    fetch('http://localhost:3000/api/users') // Schimbați cu URL-ul corect de la server
    .then(response => response.json())
    .then(managers => {
        const managerSelect = document.getElementById('managerSelect');
        // Goliți selectul înainte de a adăuga noi opțiuni
        managerSelect.innerHTML = '';
        managers.forEach(manager => {
            const option = document.createElement('option');
            option.value = manager.name; // Presupunem că fiecare manager are un ID unic
            option.textContent = manager.name; // Presupunem că managerii au o proprietate 'name'
            managerSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Eroare la încărcarea managerilor:', error);
    });
}


// Funcția ipotetică care ar trimite datele de înregistrare la server
function registerUser(userData) {
    fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la înregistrare: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert('Utilizator înregistrat cu succes!');
            // Aici poți să redirecționezi utilizatorul către o altă pagină sau să cureți formularul
        }
    })
    .catch(error => {
        console.error('Eroare la înregistrare:', error);
        alert(error.message);
    });
}
document.addEventListener('DOMContentLoaded', function() {

    
    const showRegisterFormBtn = document.getElementById('showRegisterForm');
    const showLoginFormBtn = document.getElementById('showLoginForm');
    const showTaskSectionBtn = document.getElementById('showTaskSection');
    const registerInterface = document.getElementById('registerInterface');
    const loginInterface = document.getElementById('loginInterface');
    const managerInterface = document.getElementById('managerInterface');

    function hideAllSections() {
        registerInterface.style.display = 'none';
        loginInterface.style.display = 'none';
        managerInterface.style.display = 'none';
    }

    function showSection(section) {
        hideAllSections();
        section.style.display = 'block';
    }

    showRegisterFormBtn.addEventListener('click', function() {
        showSection(registerInterface);
    });

    showLoginFormBtn.addEventListener('click', function() {
        showSection(loginInterface);
    });

    showTaskSectionBtn.addEventListener('click', function() {
        showSection(managerInterface);
    });
   


    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        loginUser(email, password);
    });

    function loginUser(email, password) {
        fetch('http://localhost:3000/api/users/login', { // Așigură-te că acest URL este corect
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare de autentificare');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                // Autentificare reușită
                alert('Bine ai venit!');
                console.log('Token:', data.token); // Log pentru token
                // Salvează tokenul în localStorage sau în sesiune
                localStorage.setItem('token', data.token);
                // Schimbă UI-ul sau redirectează utilizatorul
                // De exemplu, poți ascunde formularul de login și arăta interfața managerului
                showSection(managerInterface);
                localStorage.setItem('userEmail', email);
                loadTasks();
            } else {
                // Eroare de autentificare sau alte erori
                alert(data.message || 'Eroare necunoscută');
                console.error('Răspuns eroare:', data); // Log pentru răspunsul de eroare
            }
        })
        .catch(error => {
            // Eroare la trimiterea request-ului sau la procesarea răspunsului
            console.error('Eroare:', error);
            alert(error.message || 'A apărut o eroare la conectare.');
        });
    }
    
 
    const taskTableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

    document.getElementById('createTaskForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Previne comportamentul default al formularului
    
        // Colectează datele din formular
        const description = document.getElementById('taskDescription').value;
        const assignee = document.getElementById('taskAssignee').value;
        const manager = document.getElementById('taskManager').value;
    
        // Crează obiectul task pentru a fi trimis la server
        const taskData = {
            description,
            assigned_to: assignee,
            created_by: manager,
            status: 'OPEN' // Presupunem că toate task-urile noi sunt 'OPEN' implicit
        };
    
        // Extrage token-ul JWT salvat în localStorage
        const token = localStorage.getItem('token');
    
        // Trimite cererea la server pentru a crea un nou task
        createTask(taskData, token);
    });

    function addTaskToTable(description, manager, assignee, status) {
        const table = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow(table.rows.length);
        
        const descCell = newRow.insertCell(0);
        const managerCell = newRow.insertCell(1); // celula pentru manager
        const assigneeCell = newRow.insertCell(2);
        const statusCell = newRow.insertCell(3);
        const actionCell = newRow.insertCell(4);

        descCell.textContent = description;
        managerCell.textContent=manager;
        assigneeCell.textContent = assignee;
        statusCell.className='status';
        statusCell.textContent = status;

        const changeStatusButton = document.createElement('button');
        changeStatusButton.textContent = 'Schimbă Starea';
        changeStatusButton.className = 'changeStatusButton';
        changeStatusButton.onclick = function() { changeTaskStatus(newRow, status); };
        actionCell.appendChild(changeStatusButton);
    }

    
    window.changeTaskStatus = function(button) {
        const row = button.closest('tr');
        const statusCell = row.getElementsByClassName('status')[0];
        const currentStatus = statusCell.innerText;
        let newStatus;

        switch (currentStatus) {
            case 'Open':
                newStatus = 'Pending';
                break;
            case 'Pending':
                newStatus = 'Completed';
                break;
            case 'Completed':
                newStatus = 'Closed';
                // Disable button once task is Closed
                button.disabled = true;
                break;
            default:
                newStatus = 'Open';
                break;
        }

        if (newStatus === 'Closed') {
            // Disable button once task is Closed
            button.disabled = true;
        }
        // Aici ar veni o cerere fetch pentru a actualiza starea în backend
        console.log('Task-ul a fost schimbat la: ${newStatus}');
        statusCell.innerText = newStatus;
    }

    function loadTasks() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    
    // Definim URL-ul de baza pentru task-uri
    let url = 'http://localhost:3000/api/tasks';
    let headers = {
        'Authorization': 'Bearer ${token}'
    };

    // Daca utilizatorul este un executant, adaugam un parametru la URL pentru a filtra task-urile
    if (userRole === 'executant') {
        url += '?assigned_to=${userEmail}';
    } else if (userRole === 'manager') {
        url += '?created_by=${userEmail}';
    }

    // Facem cererea la server
    fetch(url, { headers })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la incarcarea task-urilor');
        }
        return response.json();
    })
    .then(tasks => {
        // Golim corpul tabelului inainte de a adauga noile task-uri
        const taskTableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
        taskTableBody.innerHTML = '';
    
        // Adaugam task-urile in tabel
        tasks.forEach(task => {
            addTaskToTable(task.description, task.managerName, task.assigneeEmail, task.status);
        });
    })
    .catch(error => {
        console.error('Eroare la încărcarea task-urilor:', error);
        alert(error.message);
    });

    }
});
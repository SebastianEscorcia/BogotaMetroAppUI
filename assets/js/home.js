// ========================================
// MODAL DE REGISTRO - METRO DE BOGOTÁ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const modalRegistro = document.getElementById('modalRegistro');
    const btnRegistrarUser = document.getElementById('btnRegisterUser');
    const btnCerrarModal = document.getElementById('btnCerrarModal');
    const formRegistro = document.getElementById('formRegistro');
    const btnGuardarRegistro = document.getElementById('btnGuardarRegistro');
    const loadingRegistro = document.getElementById('loadingRegistro');
    
    // Configurar fecha máxima (hace 13 años)
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const fechaMaxima = new Date();
    fechaMaxima.setFullYear(fechaMaxima.getFullYear() - 13);
    fechaNacimiento.max = fechaMaxima.toISOString().split('T')[0];

    // ========================================
    // FUNCIONES PARA ABRIR/CERRAR MODAL
    // ========================================
    
    function abrirModal() {
        modalRegistro.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Enfocar el primer campo
        setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 300);
    }
    
    function cerrarModal() {
        modalRegistro.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
        
        // Limpiar formulario
        formRegistro.reset();
        limpiarErrores();
        ocultarLoading();
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    // Abrir modal
    btnRegistrarUser.addEventListener('click', abrirModal);
    
    // Cerrar modal
    btnCerrarModal.addEventListener('click', cerrarModal);
    
    // Cerrar modal al hacer clic fuera
    modalRegistro.addEventListener('click', function(e) {
        if (e.target === modalRegistro) {
            cerrarModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalRegistro.classList.contains('active')) {
            cerrarModal();
        }
    });
    
    // ========================================
    // VALIDACIONES EN TIEMPO REAL
    // ========================================
    
    // Validar nombre y apellido (solo letras)
    const validarTexto = (input) => {
        const regex = /^[A-Za-zÀ-ÿ\s]+$/;
        return regex.test(input.value.trim()) && input.value.trim().length >= 2;
    };
    
    // Validar cédula (solo números)
    const validarCedula = (input) => {
        const regex = /^[0-9]{6,12}$/;
        return regex.test(input.value.trim());
    };
    
    // Validar email
    const validarEmail = (input) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(input.value.trim());
    };
    
    // Validar contraseña
    const validarPassword = (input) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(input.value);
    };
    
    // Validar fecha de nacimiento
    const validarFechaNacimiento = (input) => {
        if (!input.value) return false;
        
        const fechaNac = new Date(input.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const mesNacimiento = fechaNac.getMonth();
        
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        
        return edad >= 13;
    };
    
    // Función general para mostrar/ocultar errores
    function mostrarError(campo, mostrar = true) {
        const formGroup = campo.closest('.form-group');
        if (mostrar) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    }
    
    function limpiarErrores() {
        const formGroups = formRegistro.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('error'));
    }
    
    // Validaciones en tiempo real
    document.getElementById('nombre').addEventListener('input', function() {
        mostrarError(this, !validarTexto(this));
    });
    
    document.getElementById('apellido').addEventListener('input', function() {
        mostrarError(this, !validarTexto(this));
    });
    
    document.getElementById('cedula').addEventListener('input', function() {
        // Solo permitir números
        this.value = this.value.replace(/[^0-9]/g, '');
        mostrarError(this, !validarCedula(this));
    });
    
    document.getElementById('fechaNacimiento').addEventListener('change', function() {
        mostrarError(this, !validarFechaNacimiento(this));
    });
    
    document.getElementById('email').addEventListener('input', function() {
        mostrarError(this, !validarEmail(this));
    });
    
    document.getElementById('password').addEventListener('input', function() {
        const esValida = validarPassword(this);
        mostrarError(this, !esValida);
        
        // También validar confirmación si ya tiene valor
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword.value) {
            mostrarError(confirmPassword, this.value !== confirmPassword.value);
        }
    });
    
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        mostrarError(this, this.value !== password);
    });
    
    // ========================================
    // ENVÍO DEL FORMULARIO
    // ========================================
    
    function mostrarLoading() {
        formRegistro.style.display = 'none';
        loadingRegistro.style.display = 'block';
        btnGuardarRegistro.disabled = true;
    }
    
    function ocultarLoading() {
        formRegistro.style.display = 'block';
        loadingRegistro.style.display = 'none';
        btnGuardarRegistro.disabled = false;
    }
    
    function validarFormularioCompleto() {
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const cedula = document.getElementById('cedula');
        const fechaNacimiento = document.getElementById('fechaNacimiento');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const autorizacion = document.getElementById('autorizacionDatos');
        
        let esValido = true;
        
        // Validar cada campo
        if (!validarTexto(nombre)) {
            mostrarError(nombre, true);
            esValido = false;
        }
        
        if (!validarTexto(apellido)) {
            mostrarError(apellido, true);
            esValido = false;
        }
        
        if (!validarCedula(cedula)) {
            mostrarError(cedula, true);
            esValido = false;
        }
        
        if (!validarFechaNacimiento(fechaNacimiento)) {
            mostrarError(fechaNacimiento, true);
            esValido = false;
        }
        
        if (!validarEmail(email)) {
            mostrarError(email, true);
            esValido = false;
        }
        
        if (!validarPassword(password)) {
            mostrarError(password, true);
            esValido = false;
        }
        
        if (password.value !== confirmPassword.value) {
            mostrarError(confirmPassword, true);
            esValido = false;
        }
        
        if (!autorizacion.checked) {
            alert('Debes autorizar el tratamiento de datos personales para continuar.');
            esValido = false;
        }
        
        return esValido;
    }
    
    async function guardarUsuario(datosUsuario) {
        try {
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            
            console.log('Datos del usuario:', datosUsuario);
            
            
            const usuarios = JSON.parse(localStorage.getItem('usuariosMetro') || '[]');
            
           
            const usuarioExistente = usuarios.find(u => 
                u.email === datosUsuario.email || u.cedula === datosUsuario.cedula
            );
            
            if (usuarioExistente) {
                throw new Error('Ya existe un usuario registrado con este email o cédula');
            }
            
            
            usuarios.push({
                ...datosUsuario,
                id: Date.now(),
                fechaRegistro: new Date().toISOString()
            });
            
            localStorage.setItem('usuariosMetro', JSON.stringify(usuarios));
            
            return { success: true, message: 'Usuario registrado exitosamente' };
            
        } catch (error) {
            throw error;
        }
    }
    
    formRegistro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!validarFormularioCompleto()) {
            return;
        }
        
        // Mostrar loading
        mostrarLoading();
        
        try {
            // Recopilar datos del formulario
            const datosUsuario = {
                nombre: document.getElementById('nombre').value.trim(),
                apellido: document.getElementById('apellido').value.trim(),
                cedula: document.getElementById('cedula').value.trim(),
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                email: document.getElementById('email').value.trim().toLowerCase(),
                password: document.getElementById('password').value,
                autorizacionDatos: document.getElementById('autorizacionDatos').value
            };
            
            
            const resultado = await guardarUsuario(datosUsuario);
            
            
            alert('¡Registro exitoso! Bienvenido al Metro de Bogotá');
            
            
            cerrarModal();
            
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert(error.message || 'Error al registrar usuario. Por favor intenta nuevamente.');
        } finally {
            ocultarLoading();
        }
    });
    
  
   
    function capitalizarTexto(input) {
        input.addEventListener('input', function() {
            const words = this.value.split(' ');
            const capitalizedWords = words.map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
            this.value = capitalizedWords.join(' ');
        });
    }
    
    // Aplicar capitalización automática
    capitalizarTexto(document.getElementById('nombre'));
    capitalizarTexto(document.getElementById('apellido'));
    
   
    const checkboxCustom = document.querySelector('.checkbox-custom');
    const checkboxInput = document.getElementById('autorizacionDatos');
    const checkboxLabel = document.querySelector('.checkbox-label');
    
    
    checkboxCustom.addEventListener('click', function(e) {
        if (e.target !== checkboxInput) {
            checkboxInput.checked = !checkboxInput.checked;
            checkboxInput.dispatchEvent(new Event('change'));
        }
    });
    
   
    checkboxLabel.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A') { // No activar si se hace clic en enlaces
            checkboxInput.checked = !checkboxInput.checked;
            checkboxInput.dispatchEvent(new Event('change'));
        }
    });
    
    
    checkboxInput.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.checked = !this.checked;
            this.dispatchEvent(new Event('change'));
        }
    });
    
    console.log('Modal de registro inicializado correctamente');
});

ENDPOINTS
1. Endpoints de Autenticación y Usuarios (/api/auth y /api/users)

Estos son base para todos los roles. Requieren autenticación excepto register/login.

Endpoint,Método	Descripción	Request Body/Query Params	Respuesta (200 OK)	Códigos de Error
POST /api/users/register	POST	Registra un nuevo usuario (rol USER por defecto).	Body: UserRegisterDTO { "name": string, "email": string (único), "password": string, "phone": string (opcional), "address": string (opcional) }	UserResponseDTO { "id": long, "name": string, "email": string, ... (sin password) }	400 (email duplicado), 500 (error servidor)
POST /api/auth/login	POST	Autentica usuario (devuelve mensaje de éxito; token JWT en header si configuras).	Body: { "email": string, "password": string }	{ "message": "Login successful", "email": string }	401 (credenciales inválidas)
GET /api/auth/login	GET	Obtiene datos del usuario actual (post-login).	Ninguno (usa auth token).	UserResponseDTO (perfil actual).	401 (no autenticado)
POST /api/auth/logout	POST	Cierra sesión.	Ninguno.	{ "message": "Logout successful" }	401 (no autenticado)
PUT /api/users/{id}	PUT	Actualiza perfil (nombre, email, password, phone, address).	Body: UserUpdateDTO { "name": string, "email": string, "password": string (opcional), ... }	UserResponseDTO actualizado.	403 (solo propio perfil), 404 (user no encontrado)
GET /api/users/me	GET	Obtiene perfil del usuario actual.	Ninguno.	UserResponseDTO.	401 (no autenticado)
					

2. Endpoints de Servicios (/api/services y /api/admin/services)
Catálogo de servicios (e.g., vacunación, baño). Listar/ver requiere auth; CRUD solo admin.
Endpoint	Método	Descripción	Request Body/Query Params	Respuesta (200 OK)	Códigos de Error
GET /api/services	GET	Lista todos los servicios activos.	Ninguno.	List<ServiceResponseDTO> { "id": long, "name": string, "description": string, "price": double, ... }	401 (no autenticado)
GET /api/services/{id}	GET	Obtiene un servicio por ID.	Path: {id} (long).	ServiceResponseDTO.	401, 404 (no encontrado)
POST /api/admin/services	POST	Crea un nuevo servicio (solo admin).	Body: ServiceDTO { "name": string (único), "description": string, "price": double, ... }	ServiceResponseDTO creado.	401, 403 (no admin), 400 (nombre duplicado)
PUT /api/admin/services/{id}	PUT	Actualiza un servicio (solo admin).	Path: {id}, Body: ServiceDTO.	ServiceResponseDTO actualizado.	401, 403, 404, 400 (nombre duplicado)
PUT /api/admin/services/{id}/deactivate	PUT	Desactiva un servicio (soft-delete, solo admin).	Path: {id}.	204 No Content.	401, 403, 404
DELETE /api/admin/services/{id}	DELETE	Elimina un servicio (solo admin).	Path: {id}.	204 No Content.	401, 403, 404

Notas: Servicios son públicos para listar (autenticados ven catálogo para agendar citas). Admin maneja CRUD.

3. Endpoints de Mascotas (/api/pets)
Gestión de mascotas. Requiere auth; permisos por rol en servicio.
Endpoint	Método	Descripción	Request Body/Query Params	Respuesta (200 OK)	Códigos de Error
POST /api/pets	POST	Crea una mascota (dueños: para sí; empleados/admins: para cualquier ownerId).	Body: PetDTO { "name": string (req), "species": string (req), "breed": string (req), "age": int (>0), "weight": double (>0), "sex": string (req), "ownerId": long (opcional para dueños) }	PetResponseDTO { "id": long, "name": string, "owner": UserResponseDTO, "active": boolean, ... }	401, 403 (no autorizado, e.g., dueños solo propias), 400 (validaciones)
PUT /api/pets/{id}	PUT	Actualiza una mascota (dueños: propias; empleados/admins: cualquier; vets: solo ver).	Path: {id}, Body: PetDTO (sin ownerId).	PetResponseDTO actualizado.	401, 403, 404
DELETE /api/pets/{id}	DELETE	Elimina una mascota (dueños: propias; admins: cualquier).	Path: {id}.	204 No Content.	401, 403, 404
GET /api/pets/{id}	GET	Obtiene una mascota por ID (dueños: propias; empleados/vets/admins: cualquier).	Path: {id}.	PetResponseDTO.	401, 403, 404
GET /api/pets	GET	Lista mascotas (dueños: propias; empleados/vets/admins: todas).	Ninguno.	List<PetResponseDTO>.	401, 403


Notas: No hay desactivación (solo delete hard). PetResponseDTO incluye owner como UserResponseDTO (sin password).
4. Endpoints de Citas (/api/appointments)
Gestión de citas. Requiere auth; permisos por rol (dueños: propias; empleados/admins: todas; vets: asignadas).
Endpoint	Método	Descripción	Request Body/Query Params	Respuesta (200 OK)	Códigos de Error
POST /api/appointments	POST	Crea una cita (dueños: para sus mascotas; empleados/admins: cualquier). assignedTo debe ser EMPLOYEE/VETERINARIAN.	Body: AppointmentDTO { "petId": long (req), "serviceId": long (req), "assignedToId": long (req, EMPLOYEE/VET), "startDateTime": LocalDateTime (futuro, req), "note": string (≤500, opcional) }	AppointmentResponseDTO { "id": long, "pet": PetResponseDTO, "service": ServiceResponseDTO, "owner": UserResponseDTO, "assignedTo": UserResponseDTO, "status": "PENDING", ... }	401, 403 (no autorizado, e.g., dueños solo propias), 400 (validaciones, e.g., assignedTo inválido), 404 (pet/service/user no encontrado)
PUT /api/appointments/{id}	PUT	Actualiza una cita (empleados/admins: cualquier; dueños: propias).	Path: {id}, Body: AppointmentDTO.	AppointmentResponseDTO actualizado.	401, 403, 404, 400
PUT /api/appointments/{id}/cancel	PUT	Cancela una cita (solo si PENDING; dueños: propias; empleados/admins: cualquier).	Path: {id}.	204 No Content.	401, 403, 404, 400 (no PENDING)
PUT /api/appointments/{id}/status	PUT	Cambia estado (PENDING → ACCEPTED/CANCELLED; ACCEPTED → COMPLETED/CANCELLED). Solo asignado (EMPLOYEE/VET) o admin.	Path: {id}, Body: ChangeAppointmentStatusDTO { "status": "ACCEPTED" | "COMPLETED" | "CANCELLED" (req) }	204 No Content.	401, 403 (no asignado), 404, 400 (transición inválida)
GET /api/appointments/{id}	GET	Obtiene una cita por ID (dueños: propias; vets: asignadas; empleados/admins: cualquier).	Path: {id}.	AppointmentResponseDTO.	401, 403, 404
GET /api/appointments	GET	Lista citas (dueños: propias; vets/empleados: asignadas; admins: todas).	Ninguno.	List<AppointmentResponseDTO>.	401, 403
GET /api/appointments/admin	GET	Lista citas con filtros (solo admins).	Query: ownerId=long (opc), petId=long (opc), serviceId=long (opc), assignedToId=long (opc), startDate=string (ISO, opc), endDate=string (ISO, opc).	List<AppointmentResponseDTO>.	401, 403 (no admin), 400 (fechas inválidas)



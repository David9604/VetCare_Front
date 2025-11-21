# 🐾 Vistas del Módulo de Ventas

## 🧩 Contexto General

El módulo de **ventas de productos** se enfoca en gestionar todo lo relacionado con la **comercialización de productos veterinarios** (alimentos, medicamentos, accesorios, etc.).  

Incluye:
- Catálogo de productos  
- Carrito o registro de venta  
- Historial de compras/ventas  
- Gestión de stock (para empleados y administradores)

---

## 🔐 Roles y Acceso a Vistas

| Rol | Permisos principales | Vistas que usa |
|------|-----------------------|----------------|
| **Owner (Dueño de mascota)** | Ver productos, agregar al carrito, comprar, ver historial de compras. | Catálogo de productos, carrito de compras, historial de compras. |
| **Employee (Empleado)** | Registrar ventas, generar facturas, consultar inventario. | Registro de ventas, lista de productos, detalle de producto, historial de ventas. |
| **Veterinarian (Veterinario)** | Ver productos, recomendar productos, registrar productos médicos. | Catálogo de productos, sugerencias de productos, detalle de producto. |
| **Admin** | Gestión total (crear, editar, eliminar productos, ver reportes). | Panel de administración, CRUD de productos, reportes de ventas, control de inventario. |

---

## 🧱 Estructura de Vistas

A continuación se presentan las vistas organizadas por módulos, indicando el rol que las usa y su propósito.

---

### 🛒 1. Catálogo de Productos
**Ruta:** `/productos`  
**Roles:** Owner, Employee, Veterinarian, Admin  

**Descripción:**  
Página principal del módulo de productos. Muestra todos los productos disponibles con filtros (categoría, precio, tipo).

**Componentes o secciones:**
- Barra de búsqueda y filtros  
- Cards con información básica del producto (imagen, nombre, precio, stock)  
- Botón “Ver detalle”  
- Para Owner: botón “Agregar al carrito”  
- Para Employee/Admin: botones “Editar” o “Eliminar”

---

### 📦 2. Detalle del Producto
**Ruta:** `/productos/:id`  
**Roles:** Todos  

**Descripción:**  
Muestra información detallada de un producto.

**Componentes:**
- Imagen grande  
- Descripción  
- Precio, stock disponible  
- Ingredientes o uso (si es medicamento)  
- Botones según rol:
  - **Owner:** “Agregar al carrito”  
  - **Employee/Admin:** “Editar producto”  
  - **Veterinarian:** “Recomendar a cliente”

---

### 🧾 3. Carrito de Compras
**Ruta:** `/carrito`  
**Roles:** Owner  

**Descripción:**  
Vista donde el dueño de la mascota puede ver los productos seleccionados antes de confirmar la compra.

**Componentes:**
- Lista de productos agregados  
- Cantidad editable  
- Subtotal y total  
- Botón “Confirmar compra”  
- Confirmación con resumen y número de pedido

---

### 💰 4. Registro de Ventas
**Ruta:** `/ventas/nueva`  
**Roles:** Employee, Admin  

**Descripción:**  
Vista donde un empleado o administrador registra una venta presencial.

**Componentes:**
- Selección de productos (buscador o listado)  
- Ingreso de cantidad y método de pago  
- Datos del cliente (Owner)  
- Botón “Generar factura”  
- Resumen final con total

---

### 📚 5. Historial de Compras / Ventas
**Ruta:** `/ventas/historial`  
**Roles:** Owner (ver sus compras), Employee/Admin (ver todas las ventas)  

**Descripción:**  
Listado de ventas realizadas.

**Componentes:**
- Tabla con columnas: N° venta, fecha, total, estado, cliente  
- Filtro por fecha o estado  
- Opción “Ver detalle” para mostrar los productos comprados

---

### ⚙️ 6. Gestión de Productos (CRUD)
**Ruta:** `/admin/productos`  
**Roles:** Admin  

**Descripción:**  
Panel donde el administrador puede crear, editar o eliminar productos.

**Componentes:**
- Tabla de productos con acciones (✏️ Editar / 🗑️ Eliminar)  
- Botón “Agregar producto”  
- Formulario modal o vista separada con campos:
  - Nombre  
  - Descripción  
  - Categoría  
  - Precio  
  - Stock  
  - Imagen  

---
# Task Manager Demo

Aplicación web de gestión de tareas desarrollada como demo.

El proyecto permite crear tareas, consultar el listado, filtrar por estado y actualizar su progreso. 
Está construido utilizando una arquitectura frontend/backend independiente y una API REST.

## Tecnologías

### Backend
- **Node.js**
- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **class-validator / class-transformer**
- **Vitest**

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Hook Form**
- **Zod**
- **React Router**
- **Vitest**
- **Testing Library**

### Infraestructura
- **Docker**
- **Docker Compose**

## Funcionalidades

- Crear tareas con título y responsable.
- Consultar todas las tareas.
- Filtrar tareas por estado.
- Actualizar el estado de una tarea.
- Visualizar estadísticas generales de tareas.
- Validar los datos tanto en frontend como en backend.
- Gestionar estados de carga, errores y resultados vacíos.

### Estados de las tareas

| Estado | Descripción |
|---|---|
| `pending` | Pendiente |
| `in_progress` | En progreso |
| `done` | Completada |

## Arquitectura

El proyecto está dividido en dos aplicaciones independientes:

- **Frontend:** interfaz de usuario desarrollada con React.
- **Backend:** API REST desarrollada con NestJS.
- **Database:** PostgreSQL como sistema de almacenamiento.

La comunicación entre frontend y backend se realiza mediante HTTP utilizando la Fetch API.

El backend sigue una separación de responsabilidades basada en:

- **Controller:** recibe las solicitudes HTTP y gestiona las respuestas.
- **Service:** contiene la lógica de negocio.
- **Repository:** acceso y persistencia de datos mediante TypeORM.

### Estructura del proyecto

```text
task-manager-demo/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── migrations/
│   │   ├── tasks/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── scripts/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── test/
│   ├── Dockerfile
│   └── package.json
│
├── .env.example
├── .gitignore
└── docker-compose.yml
```

## Requisitos

Para ejecutar el proyecto mediante Docker se necesita:

- Docker Engine.
- Docker Compose v2.

No es necesario instalar Node.js, PostgreSQL ni las dependencias de las aplicaciones en la máquina anfitriona.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/gustavomoya/task-manager-demo.git
cd task-manager-demo
```

### 2. Configurar las variables de entorno

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

El archivo `.env` contiene la configuración local utilizada por Docker Compose.

### 3. Iniciar las aplicaciones

Desde la raíz del proyecto ejecutar:

```bash
docker compose up --build
```

Docker Compose se encarga de:

1. Iniciar PostgreSQL.
2. Esperar a que PostgreSQL esté disponible.
3. Iniciar el backend.
4. Crear la base de datos de pruebas si todavía no existe.
5. Ejecutar las migraciones de la base de pruebas.
6. Ejecutar las migraciones de la base principal.
7. Iniciar la API NestJS.
8. Iniciar el frontend React.

### 4. Acceder a la aplicación

Una vez iniciados los servicios:

| Aplicación | Dirección |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |

### 5. Detener los servicios

```bash
docker compose down
```

Este comando detiene y elimina los contenedores, pero conserva los datos de PostgreSQL en el volumen persistente.

Para volver a iniciar:

```bash
docker compose up
```

**Importante:** no utilizar `docker compose down -v` salvo que se quiera eliminar también el volumen y perder los datos almacenados.

## API REST

La API expone los siguientes endpoints:

### Crear una tarea

`POST /tasks`

Request:

```json
{
  "title": "Implement authentication",
  "assignee": "John Doe"
}
```

El estado inicial se establece automáticamente como `pending`.

### Listar tareas

`GET /tasks`

Devuelve todas las tareas registradas.

### Filtrar tareas por estado

`GET /tasks?status=pending`

Estados permitidos:

- `pending`
- `in_progress`
- `done`

### Actualizar el estado de una tarea

`PATCH /tasks/:id/status`

Request:

```json
{
  "status": "in_progress"
}
```

### Modelo de datos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Integer | Identificador autoincremental |
| `title` | Varchar(150) | Título de la tarea |
| `status` | Enum | Estado de la tarea |
| `assignee` | Varchar(100) | Responsable |
| `createdAt` | Timestamp | Fecha de creación |
| `updatedAt` | Timestamp | Fecha de actualización |

## Validaciones

Las validaciones se realizan tanto en el frontend como en el backend.

- El título es obligatorio y debe contener entre 3 y 150 caracteres.
- El responsable es obligatorio y admite hasta 100 caracteres.
- El estado debe pertenecer a los valores permitidos.
- El identificador debe ser un entero válido.
- Se rechazan propiedades no permitidas en las solicitudes.

En el frontend se utiliza Zod junto con React Hook Form.

En el backend se utiliza class-validator y el ValidationPipe global de NestJS.

## Pruebas

Se utiliza Vitest para ejecutar las pruebas automatizadas.

### Backend

Incluye pruebas unitarias del servicio y pruebas de integración E2E de la API.

Ejecutar las pruebas unitarias:

```bash
docker compose exec backend npm test
```

Ejecutar las pruebas E2E:

```bash
docker compose exec backend npm run test:e2e
```

### Frontend

Ejecutar las pruebas:

```bash
docker compose exec frontend npm test
```

Las pruebas del frontend verifican, entre otros aspectos:

- Validación del formulario.
- Creación de tareas.
- Comportamiento del filtro de tareas.

## Qué haría con más tiempo

El proyecto cubre las funcionalidades principales que se definieron para el MVP. Sin embargo, con más tiempo, trabajaría principalmente en los siguientes aspectos.

### Producto y experiencia de usuario

- **Gestión de usuarios:** actualmente, el responsable de una tarea se introduce como texto. Lo mejoraría incorporando usuarios reales, autenticación y roles, de manera que cada tarea pudiera asignarse a un miembro del equipo.
- **Historial de tareas:** guardaría quién realizó cada cambio y cuándo lo hizo. Esto permitiría consultar la evolución de una tarea y saber quién modificó su estado.
- **Búsqueda y organización:** permitiría buscar tareas por título o responsable, ordenarlas y navegar por los resultados mediante paginación.
- **Internacionalización:** prepararía la aplicación para soportar varios idiomas y diferentes preferencias visuales.

### Backend y API

- **Documentación de la API:** incorporaría Swagger/OpenAPI para que otros desarrolladores pudieran conocer y probar los endpoints fácilmente.
- **Optimización de consultas:** incorporaría búsqueda, filtros y paginación desde el backend, además de revisar los índices según las consultas más frecuentes.
- **Seguridad:** añadiría autenticación, control de permisos, protección contra solicitudes excesivas y una configuración más restrictiva de CORS.
- **Reglas de negocio:** definiría qué cambios de estado están permitidos si el funcionamiento del producto necesitara un flujo de trabajo más estricto.

### Pruebas y calidad

- **Ampliar las pruebas del frontend:** cubriría los cambios de estado, los errores de la API, la recuperación ante fallos y los estados de carga y resultados vacíos.
- **Automatizar las comprobaciones:** incorporaría un pipeline que ejecutara lint, validación de tipos, pruebas y compilación en cada cambio.
- **CI/CD:** incorporaría un pipeline que ejecutara lint, validación de tipos, pruebas y compilación en cada cambio.

### Infraestructura y operación

- **Separar las migraciones del arranque:** ejecutaría las migraciones mediante un proceso independiente, en lugar de hacerlo como parte del inicio de la API.

## Cómo usé la IA

Durante el desarrollo utilicé principalmente OpenCode como asistente de programación, complementándolo con GitHub Copilot para definir los requisitos, revisar alternativas,
gilizar algunas tareas de implementación, resolver dudas técnicas y revisar código.

### Qué le pedí

- Una propuesta de modelo de datos para las tareas: tabla, enum de estados, restricciones e índices.
- Un diagnóstico del repositorio cuando el backend no aparecía correctamente en Git.
- Una revisión crítica del backend: validaciones, manejo de errores, configuración y pruebas.
- La revisión del servicio y los tipos del frontend, incluyendo cómo interpretar los errores de la API.
- Rediseños de interfaz: algunos rediseños en el header, formulario de creación y listado de tareas.
- Revisión de las pruebas y de los comandos de verificación (lint, build, tests).
- Ayuda en la configuración de docker para el arranque de la aplicación.

### Qué acepté

- La separación **Controller → Service → Repository**, con DTOs validados por `class-validator` y `ValidationPipe` global.
- El estado como **enum nativo de PostgreSQL**, con `timestamptz` para las fechas.
- El manejo de errores del frontend con una clase `ApiError` que conserva el `status` y los `errors` del backend.
- El `trim` de `title` y `assignee` en el backend, junto con pruebas de límites y campos extra.
- El rediseño visual y el **select de estado** con actualización optimista y rollback si la API falla.

### Qué corregí o rechacé
- **Rechacé una máquina de estados como parte del flujo.** El asistente sugirió restringir las transiciones; preferí que cualquier estado válido pueda cambiarse a cualquier otro. Lo dejé anotado como mejora futura, no como regla actual.
- **Ajustes en las mejoras propuestas en la ui:** cambios visuales de estilos, mensajes, etc.
- **Revisé y corregí algunas modificaciones realizadas en las pruebas generadas:** evité mocks que solo repetían la implementación, agregué casos de validación y verifiqué que las suites pasaran de verdad.


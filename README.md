# Sistema de Retroalimentación Académica PUCP

## 📋 Descripción

Sistema web profesional para la evaluación y retroalimentación académica de la Pontificia Universidad Católica del Perú (PUCP). Permite crear formularios de evaluación dinámicos con exportación a PDF y Excel.

## ✨ Características

- 🔐 **Sistema de autenticación** seguro con credenciales protegidas
- 📝 **Formularios dinámicos** con preguntas y subpreguntas personalizables
- 📊 **Exportación a PDF** con diseño profesional y colores institucionales PUCP
- 📈 **Exportación a Excel** para análisis de datos
- 🎨 **Diseño responsivo** con paleta de colores auténtica de PUCP
- ⚡ **Interfaz moderna** construida con Next.js y Tailwind CSS

## 🚀 Tecnologías Utilizadas

- **Framework**: Next.js 15.5.2
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **PDF**: jsPDF
- **Excel**: xlsx
- **Autenticación**: Context API + localStorage

## 📁 Estructura del Proyecto

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Página de login
│   │   ├── layout.tsx        # Layout principal
│   │   └── evaluar/
│   │       └── page.tsx      # Sistema de evaluación
│   ├── components/
│   │   └── ProtectedRoute.tsx # Componente de protección de rutas
│   └── contexts/
│       └── AuthContext.tsx   # Contexto de autenticación
├── public/                   # Archivos estáticos
└── .env.local               # Variables de entorno
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/retroalimentacion-pucp.git
   cd retroalimentacion-pucp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   # Credenciales de autenticación
   AUTH_USER=admin
   AUTH_PASS=pucp2024
   ```

4. **Ejecutar el proyecto**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   
   Visita [http://localhost:3000](http://localhost:3000)

## 🔑 Credenciales de Acceso

- **Usuario**: `admin`
- **Contraseña**: `pucp2024`

## 📖 Uso del Sistema

### Inicio de Sesión
1. Accede a la página principal
2. Ingresa las credenciales proporcionadas
3. Serás redirigido al sistema de evaluación

### Crear Evaluación
1. Completa los datos del estudiante y revisor
2. Agrega preguntas y subpreguntas dinámicamente
3. Asigna puntajes y observaciones
4. Exporta los resultados en PDF o Excel

### Funcionalidades Principales
- ➕ **Agregar preguntas**: Botón "Agregar Pregunta"
- ➕ **Agregar subpreguntas**: Botón "+" en cada pregunta
- 🗑️ **Eliminar elementos**: Botones de eliminación
- 📄 **Exportar PDF**: Documento profesional con diseño PUCP
- 📊 **Exportar Excel**: Hoja de cálculo estructurada
- 🚪 **Cerrar sesión**: Botón en el header

## 🎨 Diseño

El sistema utiliza la paleta de colores oficial de PUCP:
- **Azul Principal**: `#204A9E` (RGB: 32, 74, 158)
- **Azul Oscuro**: `#162F6C` (RGB: 22, 47, 108)
- **Azul Claro**: `#EDF6FF` (RGB: 237, 246, 255)
- **Azul Acento**: `#3B82F6` (RGB: 59, 130, 246)

## 🔒 Seguridad

- Rutas protegidas con autenticación
- Credenciales almacenadas en variables de entorno
- Sesión persistente con localStorage
- Redirección automática para usuarios no autenticados

## 📦 Dependencias Principales

```json
{
  "next": "15.5.2",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "jspdf": "^2.5.2",
  "xlsx": "^0.18.5"
}
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Otras plataformas
El proyecto es compatible con cualquier plataforma que soporte Next.js.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Pontificia Universidad Católica del Perú**
- Web: [https://www.pucp.edu.pe](https://www.pucp.edu.pe)

---

### 💡 Características Técnicas

- **PDF Nativo**: Generación de PDF sin dependencias externas de canvas
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **TypeScript**: Tipado estático para mayor robustez
- **Componentes Reutilizables**: Arquitectura modular y escalable
- **Estado Global**: Gestión eficiente del estado de autenticación

---

*Desarrollado con ❤️ para la comunidad académica PUCP*

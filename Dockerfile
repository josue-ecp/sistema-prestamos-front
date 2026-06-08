# 1. Descargamos una imagen oficial de Node.js (versión 18, ideal para React)
FROM node:22-alpine

# 2. Creamos y nos movemos a la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos que dicen qué librerías necesita nuestro proyecto
COPY package*.json ./

# 4. Ejecutamos la instalación de las dependencias dentro del contenedor
RUN npm install

# 5. Copiamos el resto de los archivos de nuestro proyecto de la PC al contenedor
COPY . .

# 6. Abrimos el puerto en el que corre React (Vite usa el 5173 por defecto, React clásico el 3000)
EXPOSE 5173

# 7. El comando para arrancar el servidor de desarrollo en modo escucha
CMD ["npm", "run", "dev", "--", "--host"]
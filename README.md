# PRIME 2.2

Actualización PWA de PRIME: hábitos con selección de días, XP y niveles, seguimiento diario de agua, registros de peso/cintura, gráficas, historial, logros y menú lateral.

## Publicar en GitHub Pages
1. Descomprime el ZIP.
2. Entra al repositorio de GitHub que publica PRIME.
3. Abre **Add file → Upload files**.
4. Arrastra el CONTENIDO de esta carpeta (no la carpeta completa) a la raíz del repositorio y confirma **Commit changes**.
5. Abre PRIME desde Safari en el iPhone. Cierra la app y vuelve a abrirla; si ves la versión anterior, espera un minuto y recarga.

## Datos
Se conserva la clave localStorage `prime-tracker-v1` de la versión inicial. Los hábitos y completados existentes se cargan y se amplían con los nuevos campos. Agua, peso, cintura y XP se guardan en el almacenamiento local del navegador de ese iPhone. Usa Configuración → Exportar mis datos para crear una copia JSON.

## Notificaciones en iOS
Esta versión solicita el permiso del navegador y guarda los horarios de recordatorio de cada hábito. El service worker incluye los controladores `push` y `notificationclick`, pero **no envía notificaciones programadas por sí mismo**. Para recibir push cuando la PWA está cerrada se necesita configurar un servidor/proveedor push, claves VAPID y guardar las suscripciones de los dispositivos. GitHub Pages es alojamiento estático y no puede ejecutar ese envío programado. No se debe considerar habilitado el recordatorio automático en segundo plano hasta conectar ese servicio.

## Gráficas
Las gráficas de peso y cintura requieren al menos dos registros para mostrar una línea de tendencia. Los registros se pueden editar guardando otra medición en la misma fecha; el historial permite eliminar registros.

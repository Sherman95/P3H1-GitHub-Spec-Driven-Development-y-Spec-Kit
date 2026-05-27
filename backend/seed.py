import requests
import getpass
from datetime import datetime, timedelta

API_URL = "http://localhost:8000"

subjects_data = [
    {
        "name": "SEGURIDAD DE REDES",
        "teacher": "OSCAR EFREN CARDENAS VILLAVICENCIO",
        "color": "#EF4444", 
        "tasks": [
            {"title": "Investigación sobre Firewalls", "description": "Analizar iptables y pfSense.", "priority": "high", "status": "pending", "days_offset": 2},
            {"title": "Taller de Criptografía", "description": "Implementar cifrado asimétrico en Python.", "priority": "medium", "status": "in_progress", "days_offset": 5},
            {"title": "Examen Parcial", "description": "Estudiar temas de la unidad 1 y 2.", "priority": "high", "status": "pending", "days_offset": 10},
        ]
    },
    {
        "name": "SISTEMAS OPERATIVOS III",
        "teacher": "NANCY MAGALY LOJA MORA",
        "color": "#3B82F6", 
        "tasks": [
            {"title": "Práctica de Docker", "description": "Contenerizar una aplicación web.", "priority": "medium", "status": "completed", "days_offset": -2},
            {"title": "Administración de Linux", "description": "Creación de scripts bash para automatización.", "priority": "high", "status": "in_progress", "days_offset": 3},
            {"title": "Proyecto Final de SO", "description": "Desplegar un clúster pequeño de Kubernetes.", "priority": "high", "status": "pending", "days_offset": 15},
        ]
    },
    {
        "name": "PROGRAMACIÓN MÓVIL",
        "teacher": "JOFFRE JEORWIN CARTUCHE CALVA",
        "color": "#10B981", 
        "tasks": [
            {"title": "Diseño de UI en Flutter", "description": "Crear las pantallas principales de la aplicación.", "priority": "high", "status": "completed", "days_offset": -1},
            {"title": "Integración con API REST", "description": "Consumir datos JSON desde el backend.", "priority": "medium", "status": "in_progress", "days_offset": 4},
            {"title": "Publicación de la App", "description": "Revisar requisitos técnicos para la Play Store.", "priority": "low", "status": "pending", "days_offset": 20},
        ]
    },
    {
        "name": "GESTIÓN DE REDES",
        "teacher": "RODRIGO FERNANDO MOROCHO ROMAN",
        "color": "#F59E0B", 
        "tasks": [
            {"title": "Monitoreo con Zabbix", "description": "Configurar alertas SNMP.", "priority": "medium", "status": "pending", "days_offset": 2},
            {"title": "Simulación en Packet Tracer", "description": "Configurar VLANs y enrutamiento OSPF.", "priority": "high", "status": "completed", "days_offset": -4},
            {"title": "Informe de Auditoría", "description": "Revisar los logs del servidor central.", "priority": "medium", "status": "pending", "days_offset": 8},
        ]
    },
    {
        "name": "BASES DE DATOS NO ESTRUCTURADAS",
        "teacher": "FREDDY ANIBAL JUMBO CASTILLO",
        "color": "#8B5CF6", 
        "tasks": [
            {"title": "Modelado de Colecciones", "description": "Definir esquemas BSON para MongoDB.", "priority": "high", "status": "in_progress", "days_offset": 1},
            {"title": "Consultas de Agregación", "description": "Uso avanzado de $match, $group y $project.", "priority": "medium", "status": "pending", "days_offset": 5},
            {"title": "Implementación de Redis", "description": "Diseñar caché de sesiones de usuario.", "priority": "low", "status": "pending", "days_offset": 12},
        ]
    }
]

def main():
    print("--- Script de Inyección de Datos TaskCampus ---")
    email = input("Ingresa tu correo de la app (login): ")
    password = getpass.getpass("Ingresa tu contraseña: ")

    print("\nIniciando sesión...")
    resp = requests.post(f"{API_URL}/auth/login", json={"email": email, "password": password})
    if resp.status_code != 200:
        print("Error en login. Revisa tus credenciales.")
        return
    
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("Login exitoso.")

    for subj in subjects_data:
        print(f"\nCreando asignatura: {subj['name']}")
        subj_payload = {
            "name": subj["name"],
            "teacher": subj["teacher"],
            "color": subj["color"]
        }
        res_subj = requests.post(f"{API_URL}/subjects", json=subj_payload, headers=headers)
        
        if res_subj.status_code not in (200, 201):
            print(f"Error creando asignatura: {res_subj.json()}")
            continue
        
        subject_id = res_subj.json().get("id")
        
        for t in subj["tasks"]:
            due_date = (datetime.now() + timedelta(days=t["days_offset"])).strftime("%Y-%m-%d")
            task_payload = {
                "title": t["title"],
                "description": t["description"],
                "subject_id": subject_id,
                "due_date": due_date,
                "priority": t["priority"],
                "status": t["status"]
            }
            res_t = requests.post(f"{API_URL}/tasks", json=task_payload, headers=headers)
            if res_t.status_code in (200, 201):
                print(f"  + Tarea creada: {t['title']}")
            else:
                print(f"  - Error creando tarea {t['title']}: {res_t.json()}")

    print("\n¡Inyección de datos finalizada exitosamente! Refresca la aplicación en tu navegador.")

if __name__ == "__main__":
    main()

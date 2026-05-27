-- SCRIPT DE INYECCIÓN DE DATOS (SEED)
-- Este script inserta 5 asignaturas y 3 tareas para cada una.
-- Asigna todos los registros al PRIMER usuario que encuentre en la tabla auth.users.

DO $$
DECLARE
    v_user_id UUID;
    v_subj1_id UUID;
    v_subj2_id UUID;
    v_subj3_id UUID;
    v_subj4_id UUID;
    v_subj5_id UUID;
BEGIN
    -- Obtener el ID de tu usuario (toma el primero que encuentre en public.users)
    SELECT id INTO v_user_id FROM public.users LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No se encontraron usuarios en public.users. Debes registrarte en la app primero.';
    END IF;

    -------------------------------------------------------
    -- 1. INSERTAR ASIGNATURAS
    -------------------------------------------------------
    
    -- Asignatura 1
    INSERT INTO public.subjects (user_id, name, teacher, color)
    VALUES (v_user_id, 'SEGURIDAD DE REDES', 'OSCAR EFREN CARDENAS VILLAVICENCIO', '#EF4444')
    RETURNING id INTO v_subj1_id;

    -- Asignatura 2
    INSERT INTO public.subjects (user_id, name, teacher, color)
    VALUES (v_user_id, 'SISTEMAS OPERATIVOS III', 'NANCY MAGALY LOJA MORA', '#3B82F6')
    RETURNING id INTO v_subj2_id;

    -- Asignatura 3
    INSERT INTO public.subjects (user_id, name, teacher, color)
    VALUES (v_user_id, 'PROGRAMACIÓN MÓVIL', 'JOFFRE JEORWIN CARTUCHE CALVA', '#10B981')
    RETURNING id INTO v_subj3_id;

    -- Asignatura 4
    INSERT INTO public.subjects (user_id, name, teacher, color)
    VALUES (v_user_id, 'GESTIÓN DE REDES', 'RODRIGO FERNANDO MOROCHO ROMAN', '#F59E0B')
    RETURNING id INTO v_subj4_id;

    -- Asignatura 5
    INSERT INTO public.subjects (user_id, name, teacher, color)
    VALUES (v_user_id, 'BASES DE DATOS NO ESTRUCTURADAS', 'FREDDY ANIBAL JUMBO CASTILLO', '#8B5CF6')
    RETURNING id INTO v_subj5_id;


    -------------------------------------------------------
    -- 2. INSERTAR TAREAS
    -------------------------------------------------------

    -- Tareas para SEGURIDAD DE REDES
    INSERT INTO public.tasks (user_id, subject_id, title, description, priority, status, due_date) VALUES
    (v_user_id, v_subj1_id, 'Investigación sobre Firewalls', 'Analizar iptables y pfSense.', 'high', 'pending', CURRENT_DATE + INTERVAL '2 days'),
    (v_user_id, v_subj1_id, 'Taller de Criptografía', 'Implementar cifrado asimétrico en Python.', 'medium', 'in_progress', CURRENT_DATE + INTERVAL '5 days'),
    (v_user_id, v_subj1_id, 'Examen Parcial', 'Estudiar temas de la unidad 1 y 2.', 'high', 'pending', CURRENT_DATE + INTERVAL '10 days');

    -- Tareas para SISTEMAS OPERATIVOS III
    INSERT INTO public.tasks (user_id, subject_id, title, description, priority, status, due_date) VALUES
    (v_user_id, v_subj2_id, 'Práctica de Docker', 'Contenerizar una aplicación web.', 'medium', 'completed', CURRENT_DATE - INTERVAL '2 days'),
    (v_user_id, v_subj2_id, 'Administración de Linux', 'Creación de scripts bash para automatización.', 'high', 'in_progress', CURRENT_DATE + INTERVAL '3 days'),
    (v_user_id, v_subj2_id, 'Proyecto Final de SO', 'Desplegar un clúster pequeño de Kubernetes.', 'high', 'pending', CURRENT_DATE + INTERVAL '15 days');

    -- Tareas para PROGRAMACIÓN MÓVIL
    INSERT INTO public.tasks (user_id, subject_id, title, description, priority, status, due_date) VALUES
    (v_user_id, v_subj3_id, 'Diseño de UI en Flutter', 'Crear las pantallas principales de la aplicación.', 'high', 'completed', CURRENT_DATE - INTERVAL '1 day'),
    (v_user_id, v_subj3_id, 'Integración con API REST', 'Consumir datos JSON desde el backend.', 'medium', 'in_progress', CURRENT_DATE + INTERVAL '4 days'),
    (v_user_id, v_subj3_id, 'Publicación de la App', 'Revisar requisitos técnicos para la Play Store.', 'low', 'pending', CURRENT_DATE + INTERVAL '20 days');

    -- Tareas para GESTIÓN DE REDES
    INSERT INTO public.tasks (user_id, subject_id, title, description, priority, status, due_date) VALUES
    (v_user_id, v_subj4_id, 'Monitoreo con Zabbix', 'Configurar alertas SNMP.', 'medium', 'pending', CURRENT_DATE + INTERVAL '2 days'),
    (v_user_id, v_subj4_id, 'Simulación en Packet Tracer', 'Configurar VLANs y enrutamiento OSPF.', 'high', 'completed', CURRENT_DATE - INTERVAL '4 days'),
    (v_user_id, v_subj4_id, 'Informe de Auditoría', 'Revisar los logs del servidor central.', 'medium', 'pending', CURRENT_DATE + INTERVAL '8 days');

    -- Tareas para BASES DE DATOS NO ESTRUCTURADAS
    INSERT INTO public.tasks (user_id, subject_id, title, description, priority, status, due_date) VALUES
    (v_user_id, v_subj5_id, 'Modelado de Colecciones', 'Definir esquemas BSON para MongoDB.', 'high', 'in_progress', CURRENT_DATE + INTERVAL '1 day'),
    (v_user_id, v_subj5_id, 'Consultas de Agregación', 'Uso avanzado de $match, $group y $project.', 'medium', 'pending', CURRENT_DATE + INTERVAL '5 days'),
    (v_user_id, v_subj5_id, 'Implementación de Redis', 'Diseñar caché de sesiones de usuario.', 'low', 'pending', CURRENT_DATE + INTERVAL '12 days');

END $$;

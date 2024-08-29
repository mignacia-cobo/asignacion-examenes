import pandas as pd
from api.models import Sala, Examen

# Lee el archivo Excel para las salas
sala_df = pd.read_excel('C:\\Users\\Maxi\\Desktop\\Proyecto\\datos\\SALA.xlsx')

# Poblar la base de datos con los datos de las salas
for _, row in sala_df.iterrows():
    Sala.objects.create(
        codigo_sala=row['codigo_sala'],
        nombre_sala=row['nombre_sala'],
        capacidad=row['capacidad'],
        edificio=row['Edificio']
    )

# Lee el archivo Excel para los exámenes
examen_df = pd.read_excel('C:\\Users\\Maxi\\Desktop\\Proyecto\\datos\\EXAMEN.xlsx')

# Poblar la base de datos con los datos de los exámenes
for _, row in examen_df.iterrows():
    Examen.objects.create(
        evento=row['Evento'],
        seccion=row['Seccion'],
        asignatura=row['Asignatura'],
        modulos=row['modulos'],
        docente=row['docente']
    )

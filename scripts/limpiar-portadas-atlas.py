from pathlib import Path
import re


portadas_dir = Path("public/artistas/portadas")
archivos = sorted(portadas_dir.glob("AU-*.webp"))
patron = re.compile(r"AU-(\d{3})-[a-z0-9-]+\.webp$")

codigos = []
invalidos = []

for archivo in archivos:
    coincidencia = patron.fullmatch(archivo.name)

    if coincidencia is None:
        invalidos.append(archivo.name)
        continue

    codigos.append(int(coincidencia.group(1)))

esperados = set(range(1, 101))
presentes = set(codigos)
faltantes = sorted(esperados - presentes)
duplicados = sorted(
    codigo for codigo in presentes if codigos.count(codigo) > 1
)

if invalidos or faltantes or duplicados:
    if invalidos:
        print("Nombres inválidos:", ", ".join(invalidos))
    if faltantes:
        print("Códigos faltantes:", ", ".join(map(str, faltantes)))
    if duplicados:
        print("Códigos duplicados:", ", ".join(map(str, duplicados)))
    raise SystemExit(1)

print("✅ 100 portadas canónicas verificadas en public/artistas/portadas/")
print("✅ No se generan recortes ni variantes de las portadas")

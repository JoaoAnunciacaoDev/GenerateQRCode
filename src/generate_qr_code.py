import qrcode

while True:
    qr_name = input("Digite o nome do evento: ").strip()
    address = input("Digite o endereço do evento: ").strip()

    file_name = qr_name.replace(" ", "_")

    img = qrcode.make(address)
    with open(f"{file_name}.png", "wb") as file:
        img.save(file)

    print(f"QR Code salvo como {file_name}.png")
    
    print("Deseja gerar outro QR Code? (s/n)")
    choice = input().strip().lower()
    if choice != 's':
        break

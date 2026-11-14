import random

SUPPORTED_DICES = {
    "D4": 4,
    "D6": 6,
    "D8": 8,
    "D10": 10,
    "D12": 12,
    "D20": 20
}

def roll_dice(dice_type: str, quantity: int) -> dict:
    """Função para simular rolagem de dados.

    Args:
        dice_type: Tipo do dado que será rolado. Ex: d4, d6, d20.
        quantity: Quantidade de dados que serão rolados.

    Returns:
        Um dicionário que contém informações sobre o tipo do dado,
        resultados individuais e resultado total.

    Raises:
        ValueError: Se o tipo de dado não estiver em SUPPORTED_DICES
        ValueError: Quantidade de dados ser um número entre 1 e 100
    """
    dice_type = dice_type.upper()
    if dice_type not in SUPPORTED_DICES:
        raise ValueError("Tipo de dado não suportado.")

    if not 1 <= quantity <= 100:
        raise ValueError("A quantidade deve estar entre 1 e 100")

    sides = SUPPORTED_DICES[dice_type]
    results = [random.randint(1, sides) for _ in range(quantity)]

    return {
        "dice_type": dice_type,
        "results": results,
        "total": sum(results)
    }

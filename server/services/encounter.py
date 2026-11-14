import random
import math


ENCOUNTERS = {
    "beginner": [
        {
            "name": "Emboscada na floresta",
            "difficulty": "EASY",
            "monsters": [
                {"name": "Goblin", "quantity": 2},
                {"name": "Lobo", "quantity": 1}
            ]
        },
        {
            "name": "Ataque dos saqueadores",
            "difficulty": "MEDIUM",
            "monsters": [
                {"name": "Bandido", "quantity": 3}
            ]
        }
    ],
    "intermediate": [
        {
            "name": "Covil dos mortos-vivos",
            "difficulty": "MEDIUM",
            "monsters": [
                {"name": "Esqueleto", "quantity": 3},
                {"name": "Zumbi", "quantity": 2}
            ]
        },
        {
            "name": "Ameaça nas montanhas",
            "difficulty": "HARD",
            "monsters": [
                {"name": "Ogro", "quantity": 1},
                {"name": "Goblin", "quantity": 3}
            ]
        }
    ],
    "advanced": [
        {
            "name": "O despertar do dragão",
            "difficulty": "HARD",
            "monsters": [
                {"name": "Dragão", "quantity": 1},
                {"name": "Cultista", "quantity": 3}
            ]
        },
        {
            "name": "Fortaleza das sombras",
            "difficulty": "HARD",
            "monsters": [
                {"name": "Cavaleiro sombrio", "quantity": 2},
                {"name": "Espectro", "quantity": 2}
            ]
        }
    ]
}


def get_level_category(group_level):
    if 1 <= group_level <= 4:
        return "beginner"

    if 5 <= group_level <= 10:
        return "intermediate"

    if 11 <= group_level <= 20:
        return "advanced"

    raise ValueError("O nível do grupo deve estar entre 1 e 20.")


def generate_encounter(group_level, player_count):
    if not 1 <= player_count <= 8:
        raise ValueError("A quantidade de jogadores deve estar entre 1 e 8.")

    category = get_level_category(group_level)
    encounter = random.choice(ENCOUNTERS[category])

    monsters = []

    for monster in encounter["monsters"]:
        quantity = math.ceil(
            monster["quantity"] * player_count / 4
        )

        monsters.append({
            "name": monster["name"],
            "quantity": quantity
        })

    return {
        "name": encounter["name"],
        "difficulty": encounter["difficulty"],
        "group_level": group_level,
        "player_count": player_count,
        "monsters": monsters
    }

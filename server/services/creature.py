from models.creature import Creature


CREATURES = [
    Creature(
        name="Goblin",
        creature_type="Humanoide",
        description="Uma pequena criatura astuta e agressiva.",
        hit_points=7,
        armor_class=15,
        challenge_rating="1/4"
    ),
    Creature(
        name="Lobo",
        creature_type="Animal",
        description="Um predador selvagem que costuma caçar em grupos.",
        hit_points=11,
        armor_class=13,
        challenge_rating="1/4"
    ),
    Creature(
        name="Esqueleto",
        creature_type="Morto-vivo",
        description="Um guerreiro reanimado por forças mágicas.",
        hit_points=13,
        armor_class=13,
        challenge_rating="1/4"
    ),
    Creature(
        name="Ogro",
        creature_type="Gigante",
        description="Uma criatura enorme e muito forte.",
        hit_points=59,
        armor_class=11,
        challenge_rating="2"
    ),
    Creature(
        name="Dragão",
        creature_type="Dragão",
        description="Uma criatura poderosa, conhecida por sua força e habilidades mágicas.",
        hit_points=178,
        armor_class=19,
        challenge_rating="10"
    )
]


def get_creature(name):
    normalized_name = name.strip().casefold()

    for creature in CREATURES:
        if creature.name.casefold() == normalized_name:
            return creature

    return None
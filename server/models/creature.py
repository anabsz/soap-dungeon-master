class Creature:
    def __init__(
        self,
        name,
        creature_type,
        description,
        hit_points,
        armor_class,
        challenge_rating
    ):
        self.name = name
        self.creature_type = creature_type
        self.description = description
        self.hit_points = hit_points
        self.armor_class = armor_class
        self.challenge_rating = challenge_rating
class WeightedPoint:
    def __init__(self, x, y, wt):
        self.x = x
        self.y = y
        self.wt = wt

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"


def weighted_centroid(points):
    """
    Calculate the weighted centroid of a set of points.
    """
    x = 0
    y = 0
    total_weight = 0
    for p in points:
        x += p.x * p.wt
        y += p.y * p.wt
        total_weight += p.wt
    return WeightedPoint(x / total_weight, y / total_weight, total_weight)


if __name__ == "__main__":
    points = [
        WeightedPoint(0, 0, wt=50),
        WeightedPoint(0, 2, wt=50),
        WeightedPoint(2, 0, wt=50),
        WeightedPoint(2, 2, wt=50),
    ]
    print(weighted_centroid(points))

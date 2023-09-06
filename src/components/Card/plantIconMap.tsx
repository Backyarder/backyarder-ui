export type IconType = 'Flower' | 'flower' | 'Thistle' | 'Tree' | 'tree' | 'Fruit' | 'fruit' | "Palm or Cycad" | 'Ornamental grass' | 'Vine' | 'Deciduous shrub' | "Rush or Sedge" | 'Shrub' | "Fern" | "Epiphyte" | 'Broadleaf evergreen' | 'Herb' | 'Vegetable';

export type SunlightType = 'Full sun' | 'full sun' | 'Part shade' | 'part shade' | 'part sun/part shade';

type IconCategory = 'Deceased' | 'Phishing' | 'park' | 'Nutrition' | 'psychiatry' | 'grass' | 'temp_preferences_eco' | 'Restaurant' | 'sunny' | 'partly_cloudy_day';

type IconMap = {
  type: Record<IconType, IconCategory>
  sunlight: Record<SunlightType, IconCategory>
}

export const ICON_MAP: IconMap = {
    type: {
        'Flower': 'Deceased',
        'flower': 'Deceased',
        'Thistle': 'Phishing',
        'Tree': 'park',
        'tree': 'park',
        'Fruit': 'Nutrition',
        'fruit': 'Nutrition',
        "Palm or Cycad": 'park',
        'Ornamental grass': 'psychiatry',
        'Vine': 'psychiatry',
        'Deciduous shrub': 'grass',
        "Rush or Sedge": 'grass',
        'Shrub': 'grass',
        "Fern": 'grass',
        "Epiphyte": 'grass',
        'Broadleaf evergreen': 'park',
        'Herb': 'temp_preferences_eco',
        'Vegetable': 'Restaurant'
    },
    sunlight: {
        'Full sun': 'sunny',
        'full sun': 'sunny',
        'Part shade': 'partly_cloudy_day',
        'part shade': 'partly_cloudy_day',
        'part sun/part shade': 'partly_cloudy_day'
    }
}

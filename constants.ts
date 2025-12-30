import { 
  Sprout, TreeDeciduous, Axe, Flame, 
  Egg, Bird, Feather, 
  Sun, Moon, Sunrise, Sunset,
  Snowflake, Flower, Leaf, ThermometerSun,
  Utensils, ChefHat, Coffee, 
  Calculator, Save, Cloud, Bot,
  BatteryLow, BatteryMedium, BatteryFull, Zap,
  WifiOff, WifiLow, WifiHigh, Globe,
  VolumeX, Volume1, Volume2, Speaker,
  File, UploadCloud, CheckCircle,
  PenTool, Mail, Send,
  List, ShoppingCart, ShoppingBag,
  CloudRain, Umbrella,
  Anchor, Fish, UtensilsCrossed,
  LightbulbOff, Lightbulb, Package,
  Ticket, Popcorn, Clapperboard,
  Map, Plane, Hotel,
  Shovel,
  Mic, Music, UserCheck,
  Triangle, Square, Hexagon,
  Circle, Star, Heart, Diamond, Shield, Key, Lock, Unlock,
  MousePointer2, Gamepad2, Headphones, Watch,
  // ICONS for Logical Levels (21-30)
  CircleDot, Settings, Croissant, Wind,
  Ruler, Hammer, Home,
  BookOpen, GraduationCap, Briefcase,
  AlertTriangle, Octagon, Play,
  Truck, MousePointer, Smartphone, Keyboard, Brain,
  Trash2, RefreshCw,
  Bed, User, Grid,
  // NEW ICONS for Hard Levels (31-40)
  Baby, Skull, 
  Palette, Paintbrush, Image,
  PiggyBank, TrendingUp, Coins,
  FlaskConical, TestTube, Atom,
  Scale, Gavel, ScrollText,
  Camera, Aperture, Film,
  Thermometer, Stethoscope, Pill,
  GitBranch, GitCommit, GitMerge,
  DraftingCompass, BrickWall, Building2,
  Compass, MapPin, Gem
} from 'lucide-react';
import { LevelData, TimePieceData } from './types';

// Helper to create piece data
const createPiece = (id: string, labelKey: string, icon: any, index: number): TimePieceData => ({
  id,
  labelKey,
  descriptionKey: `${labelKey}_desc`, // Convention: label + _desc
  icon,
  correctIndex: index,
  entryPoint: `IN_${index}`,
  exitPoint: `OUT_${index}`
});

// --- THEMED LEVELS (1-20) ---
const THEMED_LEVELS: LevelData[] = [
  {
    id: 1,
    nameKey: "level_life_cycle",
    pieces: [
      createPiece('p1_egg', 'egg', Egg, 0),
      createPiece('p1_bird', 'bird', Bird, 1),
      createPiece('p1_feather', 'legacy', Feather, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 2,
    nameKey: "level_nature",
    pieces: [
      createPiece('p2_sprout', 'sprout', Sprout, 0),
      createPiece('p2_tree', 'tree', TreeDeciduous, 1),
      createPiece('p2_axe', 'timber', Axe, 2),
      createPiece('p2_fire', 'ash', Flame, 3),
    ],
    starThresholds: [12, 25]
  },
  {
    id: 3,
    nameKey: "level_day_cycle",
    pieces: [
      createPiece('p3_sunrise', 'dawn', Sunrise, 0),
      createPiece('p3_sun', 'noon', Sun, 1),
      createPiece('p3_sunset', 'dusk', Sunset, 2),
      createPiece('p3_moon', 'midnight', Moon, 3),
    ],
    starThresholds: [12, 25]
  },
  {
    id: 4,
    nameKey: "level_seasons",
    pieces: [
      createPiece('p4_spring', 'spring', Flower, 0),
      createPiece('p4_summer', 'summer', ThermometerSun, 1),
      createPiece('p4_autumn', 'autumn', Leaf, 2),
      createPiece('p4_winter', 'winter', Snowflake, 3),
    ],
    starThresholds: [15, 30]
  },
  {
    id: 5,
    nameKey: "level_meal",
    pieces: [
      createPiece('p5_appetizer', 'appetizer', Utensils, 0),
      createPiece('p5_main', 'main', ChefHat, 1),
      createPiece('p5_dessert', 'dessert', Coffee, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 6,
    nameKey: "level_tech",
    pieces: [
      createPiece('p6_abacus', 'abacus', Calculator, 0),
      createPiece('p6_floppy', 'floppy', Save, 1),
      createPiece('p6_cloud', 'cloud', Cloud, 2),
      createPiece('p6_ai', 'ai', Bot, 3),
    ],
    starThresholds: [15, 30]
  },
  {
    id: 7,
    nameKey: "level_battery",
    pieces: [
      createPiece('p7_low', 'low', BatteryLow, 0),
      createPiece('p7_med', 'connecting', Zap, 1), 
      createPiece('p7_full', 'full', BatteryFull, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 8,
    nameKey: "level_connectivity",
    pieces: [
      createPiece('p8_off', 'disconnected', WifiOff, 0),
      createPiece('p8_low', 'connecting', WifiLow, 1),
      createPiece('p8_high', 'online', WifiHigh, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 9,
    nameKey: "level_audio",
    pieces: [
      createPiece('p9_mute', 'mute', VolumeX, 0),
      createPiece('p9_low', 'quiet', Volume1, 1),
      createPiece('p9_high', 'loud', Volume2, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 10,
    nameKey: "level_upload",
    pieces: [
      createPiece('p10_file', 'file', File, 0),
      createPiece('p10_load', 'upload', UploadCloud, 1),
      createPiece('p10_done', 'done', CheckCircle, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 11,
    nameKey: "level_mail",
    pieces: [
      createPiece('p11_write', 'write', PenTool, 0),
      createPiece('p11_env', 'envelope', Mail, 1),
      createPiece('p11_send', 'send', Send, 2),
    ],
    starThresholds: [9, 18]
  },
  {
    id: 12,
    nameKey: "level_shopping",
    pieces: [
      createPiece('p12_list', 'list', List, 0),
      createPiece('p12_cart', 'cart', ShoppingCart, 1),
      createPiece('p12_bag', 'bag', ShoppingBag, 2),
    ],
    starThresholds: [9, 18]
  },
  {
    id: 13,
    nameKey: "level_rain",
    pieces: [
      createPiece('p13_cloud', 'cloud', Cloud, 0),
      createPiece('p13_rain', 'rain_cloud', CloudRain, 1),
      createPiece('p13_sun', 'sun', Sun, 2),
    ],
    starThresholds: [9, 18]
  },
  {
    id: 14,
    nameKey: "level_fishing",
    pieces: [
      createPiece('p14_bait', 'bait', Anchor, 0),
      createPiece('p14_catch', 'catch', Fish, 1),
      createPiece('p14_eat', 'main', UtensilsCrossed, 2),
    ],
    starThresholds: [9, 18]
  },
  {
    id: 15,
    nameKey: "level_idea_gen",
    pieces: [
      createPiece('p15_off', 'thought', LightbulbOff, 0),
      createPiece('p15_on', 'thought', Lightbulb, 1),
      createPiece('p15_make', 'product', Package, 2),
    ],
    starThresholds: [9, 18]
  },
  {
    id: 16,
    nameKey: "level_movie",
    pieces: [
      createPiece('p16_tick', 'ticket', Ticket, 0),
      createPiece('p16_pop', 'popcorn', Popcorn, 1),
      createPiece('p16_mov', 'movie', Clapperboard, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 17,
    nameKey: "level_travel",
    pieces: [
      createPiece('p17_pass', 'passport', Map, 0),
      createPiece('p17_fly', 'plane', Plane, 1),
      createPiece('p17_arri', 'hotel', Hotel, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 18,
    nameKey: "level_garden",
    pieces: [
      createPiece('p18_seed', 'seed', Sprout, 0),
      createPiece('p18_wat', 'water', CloudRain, 1),
      createPiece('p18_blo', 'bloom', Flower, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 19,
    nameKey: "level_music",
    pieces: [
      createPiece('p19_mic', 'mic', Mic, 0),
      createPiece('p19_song', 'song', Music, 1),
      createPiece('p19_app', 'applause', UserCheck, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 20,
    nameKey: "level_geometry",
    pieces: [
      createPiece('p20_3', 'triangle', Triangle, 0),
      createPiece('p20_4', 'square', Square, 1),
      createPiece('p20_6', 'hexagon', Hexagon, 2),
    ],
    starThresholds: [8, 15]
  }
];

// --- LOGICAL LEVELS (21-30) ---
const LOGICAL_LEVELS: LevelData[] = [
  {
    id: 21,
    nameKey: "level_coffee",
    pieces: [
      createPiece('p21_bean', 'bean', CircleDot, 0),
      createPiece('p21_grind', 'grind', Settings, 1),
      createPiece('p21_brew', 'brew', Coffee, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 22,
    nameKey: "level_bread",
    pieces: [
      createPiece('p22_wheat', 'wheat', Sprout, 0), // Wheat
      createPiece('p22_flour', 'flour', Wind, 1), // Windmill/Flour
      createPiece('p22_dough', 'dough', Circle, 2), // Dough ball
      createPiece('p22_bake', 'bake', Croissant, 3), // Bread
    ],
    starThresholds: [12, 25]
  },
  {
    id: 23,
    nameKey: "level_construction",
    pieces: [
      createPiece('p23_plan', 'plan', Ruler, 0),
      createPiece('p23_build', 'build', Hammer, 1),
      createPiece('p23_house', 'house', Home, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 24,
    nameKey: "level_education",
    pieces: [
      createPiece('p24_study', 'study', BookOpen, 0),
      createPiece('p24_grad', 'grad', GraduationCap, 1),
      createPiece('p24_work', 'work', Briefcase, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 25,
    nameKey: "level_traffic",
    pieces: [
      createPiece('p25_stop', 'stop', Octagon, 0), // Red/Stop
      createPiece('p25_ready', 'ready', AlertTriangle, 1), // Yellow/Yield
      createPiece('p25_go', 'go', Play, 2), // Green/Go
    ],
    starThresholds: [8, 16]
  },
  {
    id: 26,
    nameKey: "level_delivery",
    pieces: [
      createPiece('p26_click', 'click', MousePointer, 0),
      createPiece('p26_ship', 'ship', Truck, 1),
      createPiece('p26_arrive', 'arrive', Package, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 27,
    nameKey: "level_coding",
    pieces: [
      createPiece('p27_idea', 'idea', Brain, 0),
      createPiece('p27_code', 'code', Keyboard, 1),
      createPiece('p27_app', 'app', Smartphone, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 28,
    nameKey: "level_recycle",
    pieces: [
      createPiece('p28_trash', 'trash', Trash2, 0),
      createPiece('p28_truck', 'truck', Truck, 1),
      createPiece('p28_cycle', 'cycle', RefreshCw, 2),
    ],
    starThresholds: [10, 20]
  },
  {
    id: 29,
    nameKey: "level_solar",
    pieces: [
      createPiece('p29_sun', 'sun', Sun, 0),
      createPiece('p29_panel', 'panel', Grid, 1), // Using Grid as panel
      createPiece('p29_energy', 'energy', Zap, 2),
      createPiece('p29_light', 'bulb', Lightbulb, 3),
    ],
    starThresholds: [12, 25]
  },
  {
    id: 30,
    nameKey: "level_sleep",
    pieces: [
      createPiece('p30_bed', 'bed', Bed, 0),
      createPiece('p30_dream', 'dream', Moon, 1),
      createPiece('p30_wake', 'wake', Sunrise, 2),
    ],
    starThresholds: [10, 20]
  }
];

// --- HARD LOGICAL LEVELS (31-40) ---
const LOGICAL_LEVELS_HARD: LevelData[] = [
  {
    id: 31,
    nameKey: "level_humanity",
    pieces: [
      createPiece('p31_baby', 'baby', Baby, 0),
      createPiece('p31_adult', 'adult', User, 1), // Re-using User but context is distinctive with Baby/Skull
      createPiece('p31_elder', 'elder', Skull, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 32,
    nameKey: "level_artistry",
    pieces: [
      createPiece('p32_mix', 'palette', Palette, 0),
      createPiece('p32_paint', 'brush', Paintbrush, 1),
      createPiece('p32_art', 'frame', Image, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 33,
    nameKey: "level_finance",
    pieces: [
      createPiece('p33_save', 'piggy', PiggyBank, 0),
      createPiece('p33_grow', 'chart', TrendingUp, 1),
      createPiece('p33_rich', 'coins', Coins, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 34,
    nameKey: "level_chemistry",
    pieces: [
      createPiece('p34_mix', 'flask', FlaskConical, 0),
      createPiece('p34_react', 'tube', TestTube, 1),
      createPiece('p34_result', 'atom', Atom, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 35,
    nameKey: "level_justice",
    pieces: [
      createPiece('p35_scale', 'scale', Scale, 0),
      createPiece('p35_gavel', 'gavel', Gavel, 1),
      createPiece('p35_law', 'law', ScrollText, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 36,
    nameKey: "level_photography",
    pieces: [
      createPiece('p36_cam', 'camera', Camera, 0),
      createPiece('p36_focus', 'aperture', Aperture, 1),
      createPiece('p36_pic', 'film', Film, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 37,
    nameKey: "level_medicine",
    pieces: [
      createPiece('p37_sick', 'fever', Thermometer, 0),
      createPiece('p37_doc', 'scope', Stethoscope, 1),
      createPiece('p37_cure', 'pill', Pill, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 38,
    nameKey: "level_git",
    pieces: [
      createPiece('p38_branch', 'branch', GitBranch, 0),
      createPiece('p38_commit', 'commit', GitCommit, 1),
      createPiece('p38_merge', 'merge', GitMerge, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 39,
    nameKey: "level_architecture",
    pieces: [
      createPiece('p39_draft', 'draft', DraftingCompass, 0),
      createPiece('p39_base', 'brick', BrickWall, 1),
      createPiece('p39_tower', 'sky', Building2, 2),
    ],
    starThresholds: [8, 15]
  },
  {
    id: 40,
    nameKey: "level_exploration",
    pieces: [
      createPiece('p40_nav', 'compass', Compass, 0),
      createPiece('p40_loc', 'pin', MapPin, 1),
      createPiece('p40_win', 'gem', Gem, 2),
    ],
    starThresholds: [8, 15]
  }
];

// Combine lists
export const LEVELS: LevelData[] = [
  ...THEMED_LEVELS,
  ...LOGICAL_LEVELS,
  ...LOGICAL_LEVELS_HARD
];
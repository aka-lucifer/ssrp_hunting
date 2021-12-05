------------------------------------------------------------------------------------
-- QB Hunting
-- Designed & Written By akaLucifer#0103
-- Releasing or Claiming this as your own is against, this resources License
------------------------------------------------------------------------------------
fx_version 'bodacious'
game 'gta5'

ui_page "ui/index.html"

files {
  "ui/libraries/css/*.css",
  "ui/libraries/js/*.js",
	"ui/assets/fonts/*.eot",
	"ui/assets/fonts/*.svg",
	"ui/assets/fonts/*.ttf",
	"ui/index.html",
	"ui/*.js",
	"ui/style.css"
}

client_script "dist/client/main.js"
server_script "dist/server/main.js"

-- +set onesync_population true +set onesync_enableBeyond true (IS REQUIRED WHEN STARTING SERVER, FOR WORLD TO CREATE ANIMALS ON ITS OWN)

-- PELTS
-- ["deer_pelt_ruined"] 			         	 = {["name"] = "deer_pelt_ruined", 			        	["label"] = "Deer Pelt (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined deer pelt"},
-- ["deer_pelt_bad"] 			         	 = {["name"] = "deer_pelt_bad", 			        	["label"] = "Deer Pelt (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad deer pelt"},
-- ["deer_pelt_good"] 			         	 = {["name"] = "deer_pelt_good", 			        	["label"] = "Deer Pelt (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good deer pelt"},
-- ["deer_pelt_perfect"] 			         	 = {["name"] = "deer_pelt_perfect", 			        	["label"] = "Deer Pelt (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfert deer pelt"},

-- ["boar_pelt_ruined"] 			         	 = {["name"] = "boar_pelt_ruined", 			        	["label"] = "Boar Pelt (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined boat pelt"},
-- ["boar_pelt_bad"] 			         	 = {["name"] = "boar_pelt_bad", 			        	["label"] = "Boar Pelt (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad boar pelt"},
-- ["boar_pelt_good"] 			         	 = {["name"] = "boar_pelt_good", 			        	["label"] = "Boar Pelt (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good boar pelt"},
-- ["boar_pelt_perfect"] 			         	 = {["name"] = "boar_pelt_perfect", 			        	["label"] = "Boar Pelt (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfect boar pelt"},

-- ["lion_pelt_ruined"] 			         	 = {["name"] = "lion_pelt_ruined", 			        	["label"] = "Mountain Lion Pelt (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined lion pelt"},
-- ["lion_pelt_bad"] 			         	 = {["name"] = "lion_pelt_bad", 			        	["label"] = "Mountain Lion Pelt (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad lion pelt"},
-- ["lion_pelt_good"] 			         	 = {["name"] = "lion_pelt_good", 			        	["label"] = "Mountain Lion Pelt (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good lion pelt"},
-- ["lion_pelt_perfect"] 			         	 = {["name"] = "lion_pelt_perfect", 			        	["label"] = "Mountain Lion Pelt (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfect lion pelt"},

-- ["coyote_pelt_ruined"] 			         	 = {["name"] = "coyote_pelt_ruined", 			        	["label"] = "Coyote Pelt (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined coyote pelt"},
-- ["coyote_pelt_bad"] 			         	 = {["name"] = "coyote_pelt_bad", 			        	["label"] = "Coyote Pelt (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad coyote pelt"},
-- ["coyote_pelt_good"] 			         	 = {["name"] = "coyote_pelt_good", 			        	["label"] = "Coyote Pelt (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good coyote pelt"},
-- ["coyote_pelt_perfect"] 			         	 = {["name"] = "coyote_pelt_perfect", 			        	["label"] = "Coyote Pelt (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfect coyote pelt"},

-- ["rabbit_pelt_ruined"] 			         	 = {["name"] = "rabbit_pelt_ruined", 			        	["label"] = "Rabbit Pelt (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined rabbit pelt"},
-- ["rabbit_pelt_bad"] 			         	 = {["name"] = "rabbit_pelt_bad", 			        	["label"] = "Rabbit Pelt (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad rabbit pelt"},
-- ["rabbit_pelt_good"] 			         	 = {["name"] = "rabbit_pelt_good", 			        	["label"] = "Rabbit Pelt (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good rabbit pelt"},
-- ["rabbit_pelt_perfect"] 			         	 = {["name"] = "rabbit_pelt_perfect", 			        	["label"] = "Rabbit Pelt (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfect rabbit pelt"},

-- ["pidgeon_feathers_ruined"] 			         	 = {["name"] = "pidgeon_feathers_ruined", 			        	["label"] = "Pidgeon Feathers (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined stack of pidgeon feathers"},
-- ["pidgeon_feathers_bad"] 			         	 = {["name"] = "pidgeon_feathers_bad", 			        	["label"] = "Pidgeon Feathers (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad stack of pidgeon feathers"},
-- ["pidgeon_feathers_good"] 			         	 = {["name"] = "pidgeon_feathers_good", 			        	["label"] = "Pidgeon Feathers (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good stack of pidgeon feathers"},
-- ["pidgeon_feathers_perfect"] 			         	 = {["name"] = "pidgeon_feathers_perfect", 			        	["label"] = "Pidgeon Feathers (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfect stack of pidgeon feathers"},

-- ["hawk_feathers_ruined"] 			         	 = {["name"] = "hawk_feathers_ruined", 			        	["label"] = "Hawk Feathers (Ruined)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A ruined stack of hawk feathers"},
-- ["hawk_feathers_bad"] 			         	 = {["name"] = "hawk_feathers_bad", 			        	["label"] = "Hawk Feathers (Bad)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A bad stack of hawk feathers"},
-- ["hawk_feathers_good"] 			         	 = {["name"] = "hawk_feathers_good", 			        	["label"] = "Hawk Feathers (Good)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A good stack of hawk feathers"},
-- ["hawk_feathers_perfect"] 			         	 = {["name"] = "hawk_feathers_perfect", 			        	["label"] = "Hawk Feathers (Perfect)",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = ".png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A perfect stack of hawk feathers"},

-- MEATS
-- ["raw_venison_meat"] 			         	 = {["name"] = "raw_venison_meat", 			        	["label"] = "Raw Venison Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_venison_meat"] 			         	 = {["name"] = "cooked_venison_meat", 			        	["label"] = "Cooked Venison Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- ["raw_pork_meat"] 			         	 = {["name"] = "raw_pork_meat", 			        	["label"] = "Raw Pork Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_pork_meat"] 			         	 = {["name"] = "cooked_pork_meat", 			        	["label"] = "Cooked Pork Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- ["raw_lion_meat"] 			         	 = {["name"] = "raw_lion_meat", 			        	["label"] = "Raw Lion Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_lion_meat"] 			         	 = {["name"] = "cooked_lion_meat", 			        	["label"] = "Cooked Lion Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- ["raw_coyote_meat"] 			         	 = {["name"] = "raw_coyote_meat", 			        	["label"] = "Raw Coyote Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_coyote_meat"] 			         	 = {["name"] = "cooked_coyote_meat", 			        	["label"] = "Cooked Coyote Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- ["raw_mutton_meat"] 			         	 = {["name"] = "raw_mutton_meat", 			        	["label"] = "Raw Mutton Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_mutton_meat"] 			         	 = {["name"] = "cooked_mutton_meat", 			        	["label"] = "Cooked Mutton Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- ["raw_pidgeon_meat"] 			         	 = {["name"] = "raw_pidgeon_meat", 			        	["label"] = "Raw Pidgeon Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_pidgeon_meat"] 			         	 = {["name"] = "cooked_pidgeon_meat", 			        	["label"] = "Cooked Pidgeon Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- ["raw_hawk_meat"] 			         	 = {["name"] = "raw_hawk_meat", 			        	["label"] = "Raw Hawk Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},
-- ["cooked_hawk_meat"] 			         	 = {["name"] = "cooked_hawk_meat", 			        	["label"] = "Cooked Hawk Meat",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "_meat.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = ""},

-- Items
-- ["deer_horn"] 			         	 = {["name"] = "deer_horn", 			        	["label"] = "Deer Horn",                 		["weight"] = 1111,      ["type"] = "item",      ["image"] = "deer_horn.png",             ["unique"] = false,     ["useable"] = true,     ["shouldClose"] = true,    ["combinable"] = nil,   ["description"] = "A deer horn from a deer."},
-- ["hunting_tent"] 			 		 = {["name"] = "hunting_tent", 					["label"] = "Hunting Tent", 				["weight"] = 5000, 		["type"] = "item", 		["image"] = "hunting_tent.png", 			["unique"] = false, 	["useable"] = true, 	["shouldClose"] = true,	   ["combinable"] = nil,   ["description"] = "A hunting tent, to assist you in hunting down wildlife!"},
-- ["campfire_kit"] 			 		 = {["name"] = "campfire_kit", 					["label"] = "Campfire Kit", 				["weight"] = 5000, 		["type"] = "item", 		["image"] = "campfire_kit.png", 			["unique"] = false, 	["useable"] = true, 	["shouldClose"] = true,	   ["combinable"] = nil,   ["description"] = "A campfire kit, to cook all your hunted down wildlife!"},
* Checkout the code
* setup SST and AWS stuff - https://sst.dev/guide.html
* pnpm install in root directory
* pnpm install in packages/core
* pnpm install in packages/functions
* pnpm install in packages/frontend

* Run Dev backend - from root
  * pnpm sst dev
* Run Dev Frontend - from frontend folder
  * pnpm run dev
 
* Deploy to Prod
  * pnpm sst deploy --stage prod

TODO:
[x] display filter options in effect when popout thingo is closed.
[x] display rowcount
[x] Alphabetical ordering of mechs/variants
[x] Clear advance filters button

[x] Range input for numerical values
[x] better looking text boxes for text?
[x] Role 'Jugernaut' bug...

[x] mech detail

[x] Filter by calculated BV based on Pilot/Gunnery Skills...
[x] Filter by calculated PV based on pilot skill

[ ] delay / async filtering?
[ ] More intelligent linking to Flechs, e.g. Clan mechs tend to not include bracket?

[ ] Weapons Search 
      ISLBXAC10 vs LB 10-X AC
        Do we search better? Or store better and map there?

[ ] Weapon stats searching
    * Alpha Strike max damage
    * Max damage at range
    * Avg dmg calculator?
    * Rear weapons?
    * flippy arms


[ ] Make it look better

[ ] Fix ts ignores properly

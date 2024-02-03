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

[x] Row count on initial load.

[x] Force Builder - add / remove
[x] Force Builder - total up BV
[x] Force Builder - Move force builder to new component
[x] Force Builder - save to cookies and add to onLoad
[x] Force Builder - change mechwarrior skills
[x] Force Builder - show current force BV in filter summary
[x] Force Builder - Open all in Flechs....

[ ] Order Eras chronologically
[ ] Select multiple eras - additive or subtractive???? and/or?
[ ] select multiple factions? - additive or subtractive???? and/or?
[ ] List faction/era availability for mech
[ ] List faction/era availability for force

[ ] Refactor - move all functions that use data files to be wrapped by a class, 
    then can replace with server calls in the future...

[ ] Force builder - save to server when logged in / select force modal?
    [x] DynamoDB
    [x] Crud API
    [ ] add name, description to force when logged in
    [ ] Show save button if logged in
    [ ] call create API
    [ ] 

[ ] Copy force to clipboard in MUL format? Print?

[ ] Refactor unit page further into smaller components!

SHARE WITH VAULT DISCORD?
[ ] remove 'notes page'
[ ] write a 'how to' page
[ ] landing page?
[ ] disable login till manual confirm?
[ ] put functionality behind login for now?
[ ] issue / suggestions - if github, remove data files?


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

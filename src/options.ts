const blockListElement = document.getElementById("blockList") as HTMLUListElement;
const newSiteInput = document.getElementById("newSite") as HTMLInputElement;
const addSiteButton = document.getElementById("addSite") as HTMLButtonElement;

document.addEventListener("DOMContentLoaded", () => {


    function loadBlockList() {
        chrome.storage.local.get('blockList', (data) => {
            const blockList = data.blockList || [];
            blockListElement.innerHTML = ''; // clear the current list;


            // Populate the list whith the blocked sites

            blockList.forEach((site: string, index: number) => {
                const li = document.createElement("li");
                li.textContent = site;


                //Add a remove button for the eleemnt
                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.style.marginLeft = '10px';
                removeButton.addEventListener('click', () => {
                    removeSite(index);
                });

                li.appendChild(removeButton);
                blockListElement.append(li);
            });
        });
    }

    loadBlockList();

    addSiteButton.addEventListener('click',()=>{
        const newSite = newSiteInput.value.trim();
        if (newSite){
            chrome.storage.local.get('blockList',(data) =>{
                const blockList = data.blockList || [];
                blockList.push(newSite);


                // Save the new list
                chrome.storage.local.set({blockList}, () => {
                    newSiteInput.value = '';
                    loadBlockList(); // Rerender the block list
                })
            })
        }
    })

    function removeSite(index:number) {
        chrome.storage.local.get('blocklist',(data)=>{
            const blockList = data.blockList || [];
            blockList.splice(index,1);


            chrome.storage.local.set({blockList}, ()=>{
                loadBlockList();
            })
        })
    }
});
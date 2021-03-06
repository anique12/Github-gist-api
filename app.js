/**
 * Return the object with file names and file urls arrays contained in the files array.
 * @param { object } files Input received by the procedure.
 * @return { object } object containing file information.
 *
 */
function getFileType( files ) {
    var filesTag = [];
    var filesUrl = [];
    var fileNames = Object.keys( files );
    fileNames.forEach( fileName => {
         const file = files[`${fileName}`];
         const name =  file.filename;
         const fileNameSplit = name.split('.');
         filesTag.push( fileNameSplit[ fileNameSplit.length - 1 ] );
         filesUrl.push( file.raw_url );
    })
    return { filesTag, filesUrl };
}

/**
 * Return the array with users that forked the gist.
 * @param { string } forkUrl Url to fetch data.
 * @return { array } array containing avatars.
 *
 */
async function getForks( forkUrl ) {
    let forkAvatars = [];
    const res = await fetch( `${forkUrl} `)
    const data = await res.json();
    if ( data.length > 0 ) {
        var i = 0;
        // push first 3 avatar urls.
        while( i < 3 && data[i] != null ) {
            forkAvatars.push( data[i].owner.avatar_url );
            i++;
        }
    }
    return forkAvatars;
}

/**
 * Trigger when user click on search button. It fetches the gists and display on table.
 *
 */
async function search() {
    var temp = "";
    const name = document.getElementById( 'username' ).value;
    
    if( name == '' ) {
        alert( "Please Enter username" )
        return;
    }
    const res = await fetch( `https://api.github.com/users/${name}/gists` );
    res.json().then( data => {
        if ( data.length > 0 ) {
            data.forEach( ( itemData, index ) => {
            const fileInfo = getFileType( itemData.files );
            getForks( itemData.forks_url ).then( urls => {
                var imgs = "";
                var noData = "No Forks";
                var selectors = `tableData${ index+1 }`;
                urls.forEach( url => {
                    imgs += `<img src=${ url }></img>`;
                })
                urls.length > 0 ? document.getElementById(selectors).innerHTML = imgs : document.getElementById(selectors).innerHTML = noData;
            });
            temp+="<tr><td>";
            fileInfo.filesTag.forEach( ( tag, index ) => {
                temp += `<div><span class='lName'>${ tag }</span><a href=${ fileInfo.filesUrl[ index ] } target='_blank'><span class='fa fa-link'></a></span</div>`
            });
            temp += `</td><td id=tableData${ index+1 }></td></tr>`  
            });   
        }
        data.length == 0 ?  document.getElementById('data').innerHTML = "<h4>No Data to Display</h4>" : document.getElementById('data').innerHTML = temp;
    })
}
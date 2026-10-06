let products=[];
let recentProducts=[];

for(let category of storeData.categories){
    for(let subcategory of category.subcategories){
        for(let product of subcategory.products){
            products.push(product);
        }
    }
}


function showProducts(){

    let output=document.getElementById("products");

    let html="";

    for(let product of products){

        html+=`
            <div class="card">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
                <p>Brand: ${product.brand}</p>
                <p>Rating: ⭐ ${product.rating}</p>
                <button onclick="viewProduct(${product.id})">
                    View Product
                </button>
            </div>
        `;
    }

    output.innerHTML=html;
}


function viewProduct(id){

    let product=products.find(function(item){
        return item.id==id;
    });

    document.getElementById("modalName").innerText=product.name;
    document.getElementById("modalBrand").innerText="Brand: "+product.brand;
    document.getElementById("modalPrice").innerText="Price: ₹"+product.price.toLocaleString("en-IN");
    document.getElementById("modalRating").innerText="Rating: ⭐ "+product.rating;
    document.getElementById("modalStock").innerText="Stock: "+product.stock;
    document.getElementById("modalCategory").innerText="Category: "+product.category;

    document.getElementById("modal").style.display="block";

    addToHistory(product);
}


function addToHistory(product){

    let index=recentProducts.findIndex(function(item){
        return item.id==product.id;
    });

    if(index!=-1){
        recentProducts.splice(index,1);
    }

    recentProducts.unshift(product);

    if(recentProducts.length>5){
        recentProducts.pop();
    }

    showRecentProducts();
}


function showRecentProducts(){

    let output=document.getElementById("recentlyViewed");

    if(recentProducts.length==0){

        output.innerHTML=`
            <div class="empty">
                No recently viewed products
            </div>
        `;

        return;
    }

    let html="<div class='recent'>";

    for(let product of recentProducts){

        html+=`
            <div class="recent-card">
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString("en-IN")}</p>
                <button onclick="viewProduct(${product.id})">
                    View Product
                </button>
            </div>
        `;
    }

    html+="</div>";

    output.innerHTML=html;
}


function removeHistory(){

    recentProducts=[];

    showRecentProducts();
}


function closeModal(){

    document.getElementById("modal").style.display="none";
}


window.onclick=function(event){

    let modal=document.getElementById("modal");

    if(event.target==modal){
        closeModal();
    }
};


showProducts();
showRecentProducts();

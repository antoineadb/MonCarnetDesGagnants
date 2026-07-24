export default class Postcard {

    constructor(data = {}) {

        this.data = data;

    }

    render() {

        const card = document.createElement("div");

        card.className = "postcard";

        card.innerHTML = `

            <div class="postcard-inner">

                <div class="postcard-front">

                    <div class="postcard-photo">

                        ${
                            this.data.image
                                ? `<img src="${this.data.image}" alt="">`
                                : `<div class="postcard-placeholder">📮</div>`
                        }

                    </div>

                    <div class="postcard-bottom">

                        <h3>${this.data.title ?? ""}</h3>

                        <p>${this.data.location ?? ""}</p>

                        <span>${this.data.date ?? ""}</span>

                    </div>

                </div>

            </div>

        `;

        return card;

    }

}
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);

export default function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    this.watchDate = watchDate ? dayjs(watchDate, 'YYYY-MM-DD') : null;
    this.userId = userId;

    // customize toJSON method to return the object with date only, no time
    this.toJSON = () => {
        return {
            ...this,
            watchDate: this.watchDate ? this.watchDate.format("YYYY-MM-DD") : null,
        };
    };
}
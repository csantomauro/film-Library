import dayjs from "dayjs";

export default function Film(id, title, isFavorite = false, watchDate = null, rating = null, userId = 1) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    this.watchDate = watchDate ? dayjs(watchDate, 'YYYY-MM-DD') : null;
    this.userId = userId

    this.toString = () => {
        const watchDate = this.watchDate ? this.watchDate.format('DD/MM/YYYY') : null

        return `Id: ${this.id}, ` +
            `Title: ${this.title}, Favorite: ${this.favorite}, ` +
            `Watch date: ${watchDate}, Score: ${this.rating}, ` +
            `User: ${this.userId}`;
    }

    this.formatWatchDate = (format = 'MMMM D, YYYY') => {
        return this.watchDate ? this.watchDate.format(format) : undefined;
    };
}
import {Injectable} from "@angular/core";
import {createEffect, Actions, ofType, act} from "@ngrx/effects";
import {concatMap, exhaustMap, map, mergeMap} from "rxjs/operators";
import {BooksService} from "../shared/services";
import {BooksPageActions, BooksApiActions} from "./actions";

@Injectable()
export class BooksApiEffects {
    constructor(private booksService: BooksService, private action$: Actions) {
    }

    loadBooks$ = createEffect(() =>
        this.action$.pipe(
            ofType(BooksPageActions.enter),
            exhaustMap(() =>
                this.booksService.all().pipe(
                    map(books => BooksApiActions.booksLoaded({books}))
                )
            )
        ));

    createBook$ = createEffect(() =>
        this.action$.pipe(
            ofType(BooksPageActions.createBook),
            concatMap(action =>
                this.booksService
                    .create(action.book)
                    .pipe(
                        map(book => BooksApiActions.bookCreated({book}))
                    )
            )
        ));

    updateBook$ = createEffect(() =>
        this.action$.pipe(
            ofType(BooksPageActions.updateBook),
            concatMap(action =>
                this.booksService
                    .update(action.bookId, action.changes)
                    .pipe(
                        map(book => BooksApiActions.bookUpdated({book}))
                    )
            )
        ));

    deleteBook$ = createEffect(() =>
        this.action$.pipe(
            ofType(BooksPageActions.deleteBook),
            mergeMap(action =>
                this.booksService
                    .delete(action.bookId)
                    .pipe(
                        map(() => BooksApiActions.bookDeleted({bookId: action.bookId}))
                    )
            )
        ));
}

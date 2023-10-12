/**
 * A new instance of deferred is constructed by calling `new DeferredPromse<T>()`.
 * The purpose of the deferred object is to expose the associated Promise
 * instance APIs that can be used for signaling the successful
 * or unsuccessful completion, as well as the state of the task.
 * @export
 * @class DeferredPromise
 * @implements {Promise<T>}
 * @template T
 * @example
 * const deferred = new DeferredPromse<string>();
 * console.log(deferred.state); // 'pending'
 *
 * deferred
 * .then(str => console.log(str))
 * .catch(err => console.error(err));
 *
 * deferred.resolve('Foo');
 * console.log(deferred.state); // 'fulfilled'
 * // deferred.reject('Bar');
 */
export class DeferredPromise<T> implements Promise<T> {
  private _promise: Promise<T>;

  private _resolve: any;

  private _reject: any;

  private _state: 'pending' | 'fulfilled' | 'rejected' = 'pending';

  public get state(): 'pending' | 'fulfilled' | 'rejected' {
    return this._state;
  }

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  public then<TResult1, TResult2>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>,
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected);
  }

  public catch<TResult>(
    onrejected?: (reason: any) => TResult | PromiseLike<TResult>,
  ): Promise<T | TResult> {
    return this._promise.catch(onrejected);
  }

  public resolve(value?: T | PromiseLike<T>): void {
    this._resolve(value);
    this._state = 'fulfilled';
  }

  public reject(reason?: any): void {
    this._reject(reason);
    this._state = 'rejected';
  }

  readonly [Symbol.toStringTag]: string = 'Promise';

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this._promise.finally(onfinally);
  }
}

import { Injectable } from '@angular/core'
import { Subject, Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private channels: { [key: string]: Subject<any> } = {}

  subscribe(topic: string, observer: (_: any) => void): Subscription {
    const ctx = this

    if (!ctx.channels[topic]) { ctx.channels[topic] = new Subject<any>() }

    return ctx.channels[topic].subscribe(observer)
  }

  publish(topic: string, data: any): void {
    const ctx = this

    const subject = ctx.channels[topic]
    if (!subject) { return } // Or you can create a new subject for future subscribers

    subject.next(data)
  }

  destroy(topic: string): null {
    const ctx = this
    const subject = ctx.channels[topic]
    if (!subject) {
      return
    }

    subject.complete()
    delete ctx.channels[topic]
  }

}


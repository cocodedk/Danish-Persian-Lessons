import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findChildMission } from '../child/missions'
import { RuledSection } from '../components/RuledSection'
import { FullTeachingCard } from '../components/EntryRenderers'
import { WordBuilder } from '../components/WordBuilder'
import { Button } from '../components/Button'
import { Celebration } from '../components/Celebration'
import { RewardOverlays } from '../components/RewardOverlays'
import { PersianText } from '../components/PersianText'
import { useRevealInView } from '../components/useRevealInView'
import { addCollectedMission } from '../progress/childCollection'
import { useCelebration } from '../rewards/useCelebration'
import './ChildJourney.css'
import './ChildWordMission.css'

type Phase = 'model' | 'guide' | 'ready' | 'recall' | 'complete'
type Completion = 'success' | 'revealed' | null

export default function ChildWordMission() {
  const { id = '' } = useParams()
  const mission = findChildMission(id)
  const [phase, setPhase] = useState<Phase>('model')
  const [completion, setCompletion] = useState<Completion>(null)
  const celebration = useCelebration()
  const completionRef = useRevealInView(phase === 'complete')

  if (!mission) return <Navigate to="/opdag" replace />

  function finishRecall() {
    const firstCompletion = addCollectedMission(mission!.id)
    celebration.cheer(firstCompletion ? 'page' : 'replay')
    setCompletion('success')
    setPhase('complete')
  }

  function finishWithHelp() {
    setCompletion('revealed')
    setPhase('complete')
  }

  return (
    <main className="child-word" lang="da">
      <RuledSection>
        <header className="child-header">
          <div>
            <p className="child-eyebrow">Ordværksted</p>
            <h1>{mission.word.da}</h1>
          </div>
          <Link to="/opdag">Vælg et andet ord</Link>
        </header>

        <div className="child-word__workspace">
          {phase === 'model' && (
            <section className="child-word__model">
              <h2 className="visually-hidden">Se ordet</h2>
              <FullTeachingCard entry={mission.word.entry} imageEntryId={mission.imageEntryId} />
              <p className="child-word__round-plan">
                Du bygger ordet to gange: først med hjælp, så selv.
              </p>
              <Button onClick={() => setPhase('guide')}>Byg ordet</Button>
            </section>
          )}

          {phase === 'guide' && (
            <WordBuilder
              mission={mission}
              guided
              onComplete={() => setPhase('ready')}
              onContinue={() => setPhase('ready')}
            />
          )}

          {phase === 'ready' && (
            <section className="child-word__round-ready" aria-labelledby="round-ready-title">
              <p className="child-eyebrow">1 af 2 færdig</p>
              <h2 id="round-ready-title">Du byggede ordet med hjælp</h2>
              <p>Byg det én gang selv, så kommer det i din samling.</p>
              <Button onClick={() => setPhase('recall')}>Prøv selv</Button>
            </section>
          )}

          {phase === 'recall' && (
            <WordBuilder
              mission={mission}
              guided={false}
              onComplete={finishRecall}
              onContinue={finishWithHelp}
            />
          )}

          {phase === 'complete' && (
            <section className="child-word__complete">
              <div className="child-word__result" ref={completionRef}>
                <h2 className="visually-hidden">Dit færdige ord</h2>
                {completion === 'success' ? (
                  <>
                    <Celebration reward={celebration.reward} tickLabel="Bygget" />
                    <p className="child-word__saved" aria-live="polite">
                      Nu er <PersianText entry={mission.word.entry} /> i din samling.
                    </p>
                  </>
                ) : (
                  <div className="child-word__helped">
                    <strong>Set med hjælp</strong>
                    <p>Du så hele ordet. Det er klar, når du vil prøve igen.</p>
                  </div>
                )}
              </div>
              <FullTeachingCard entry={mission.word.entry} imageEntryId={mission.imageEntryId} />
              <div className="child-word__actions">
                {completion === 'revealed' && (
                  <Button onClick={() => { setCompletion(null); setPhase('recall') }}>
                    Prøv igen
                  </Button>
                )}
                <Link className="child-action-link" to="/opdag">Prøv et ord mere</Link>
                <Link className="child-action-link child-action-link--quiet" to="/opdag">
                  Færdig for nu
                </Link>
              </div>
              {completion === 'success' && <RewardOverlays celebration={celebration} />}
            </section>
          )}
        </div>
      </RuledSection>
    </main>
  )
}

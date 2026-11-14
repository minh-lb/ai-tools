# Severity Model

Severity reflects demonstrated impact and realistic reachability; confidence reflects evidence quality. Do not turn uncertainty into a low-severity finding. Put unresolved hypotheses in verification gaps.

| Severity | Impact when triggered |
|---|---|
| Critical | Catastrophic compromise, irreversible widespread data loss, tenant escape, or complete outage of a critical service with credible exposure |
| High | Serious security/data exposure, duplicate destructive work, broken main workflow or known consumers, damaging rollout |
| Medium | Real but bounded edge-case failure, significant diagnostic/scale issue, or evidenced architecture/testing risk |
| Low | Limited impact or likelihood, localized defect or nonblocking maintenance risk |

Calibrate using blast radius, actual access/preconditions, likelihood at expected scale, detectability, recovery and effective mitigations. Race timing, privileged access or a multi-step trigger does not automatically cap severity: a realistic catastrophic race can still be Critical. Explain material preconditions. Tests do not mitigate exposure unless an effective gate catches the issue before release.

Missing coverage has its own risk and does not automatically inherit the worst hypothetical defect's severity. If a bug and its missing regression test share one remedy, report the bug once and include the test in Fix. Never inflate findings by repeating one root cause under several dimensions.

Combine related findings only when their interaction has a credible trigger; explain aggregate risk in Summary without mechanically escalating individual findings. Style preferences, speculative future requirements and unsupported scaling claims are not defects.
